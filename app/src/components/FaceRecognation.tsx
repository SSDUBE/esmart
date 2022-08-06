import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, Pressable } from 'react-native';
// import * as tf from '@tensorflow/tfjs';
import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { Face } from 'expo-camera/build/Camera.types';
import { cropPicture } from '../utilities/imageHelper';
import {
  convertBase64ToTensor,
  getModel,
  startPrediction,
} from '../utilities/tensorHelper';
// import * as facemesh from '@tensorflow/tfjs'

const RESULT_MAPPING = ['9701014800011', '9701014800011', '9811100934083'];

export const FaceRecognation = ({ suspendAccount }: any) => {
  const camRef = React.useRef<any>(null);
  const [hasPermission, setHasPermissions] = React.useState(false);
  const [isTfReady, setIsTfReady] = React.useState(false);
  const [faceData, setFaceData] = React.useState<Face[]>([]);

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [presentedModel, setPresentedModel] = React.useState('');

  React.useEffect(() => {
    // (async function () {
    //   // await tf.ready();
    //   const { status } = await Camera.requestCameraPermissionsAsync();
    //   setHasPermissions(status === 'granted');
    //   setIsTfReady(true);

    // })();
    console.log('am ready');
    setInterval(function () {
      console.log('hello there');
      handleImageCapture();
    }, 15000);
  }, []);

  async function handleImageCapture() {
    setIsProcessing(true);
    const imageData = await camRef.current.takePictureAsync({
      base64: true,
    });

    processImagePrediction(imageData);
  }

  async function processImagePrediction(base64Img: any) {
    const croppedData = await cropPicture(base64Img, 300);
    const model = await getModel();
    const tensor = await convertBase64ToTensor(croppedData?.base64);

    const prediction = await startPrediction(model, tensor);

    const highestPrediction = prediction.indexOf(
      Math.max.apply(null, prediction)
    );

    if ((prediction[highestPrediction] * 100) < 60) {
      suspendAccount(null)
    } else {
      suspendAccount(RESULT_MAPPING[highestPrediction])
    }
    console.log('highestPrediction111 ', prediction[highestPrediction]);
    console.log('highestPrediction ', RESULT_MAPPING[highestPrediction]);
  }

  function getFaceView() {
    if (faceData.length === 0) {
      return (
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>No Faces</Text>
        </View>
      );
    } else {
      return faceData.map((face, index) => {
        const eyesShut =
          face.rightEyeOpenProbability < 0.4 &&
          face.leftEyeOpenProbability < 0.4;
        const winking =
          !eyesShut &&
          (face.rightEyeOpenProbability < 0.4 ||
            face.leftEyeOpenProbability < 0.4);
        const smiling = face.smilingProbability > 0.7;

        return (
          <View style={styles.faces} key={index}>
            <Text style={styles.faceDesc}>
              Eyes Shut: {eyesShut.toString()}
            </Text>
            <Text style={styles.faceDesc}>Winking: {winking.toString()}</Text>
            <Text style={styles.faceDesc}>Smiling: {smiling.toString()}</Text>
          </View>
        );
      });
    }
  }

  function handleFacesDetected({ faces }: FaceDetectionResult) {
    setFaceData(faces);
    // console.log('faces ', faces);
  }

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      {/* <Text>{isTfReady ? 'Ready' : 'Waiting'}</Text> */}
      <Camera
        ref={camRef}
        type={Camera.Constants.Type.front}
        style={styles.camera}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      >
        {/* {getFaceView()} */}
      </Camera>
      {/* <Pressable onPress={handleImageCapture} style={{width: 60, height: 20, backgroundColor: 'red'}}></Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faces: {
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  faceDesc: {
    fontSize: 20,
  },
});
