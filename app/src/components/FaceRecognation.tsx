import React from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
// import * as tf from '@tensorflow/tfjs';
import { Camera, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { Face } from 'expo-camera/build/Camera.types';
// import * as facemesh from '@tensorflow/tfjs'

export const FaceRecognation = () => {
  const camRef = React.useRef(null)
  const [hasPermission, setHasPermissions] = React.useState(false);
  const [isTfReady, setIsTfReady] = React.useState(false);
  const [faceData, setFaceData] = React.useState<Face[]>([]);

  React.useEffect(() => {
    (async function () {
      // await tf.ready();
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermissions(status === 'granted');
      setIsTfReady(true);
    })();
  }, []);

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
    console.log('faces ', faces);
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
