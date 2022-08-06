import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Alert,
  AppState,
  AppStateStatus,
  Vibration,
} from 'react-native';
import { AppContext } from '../context/context';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { FaceRecognation } from '../components/FaceRecognation';
import { db } from '../utilities/Firebase';
import {
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  collection,
} from 'firebase/firestore';
import { colors } from '../constants/Colors';
import * as Location from 'expo-location';
import { getCameraPermissionsAsync } from 'expo-camera';
import { GameService } from '../services/Game';
import { LocationPermissionResponse } from 'expo-location';
import { getDistance, getPreciseDistance } from 'geolib';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/RootStackParamList';
import { Loader } from '../components/Loader';

interface IScrumble {
  scrumble: string;
  gameID: number;
}

interface IGame {
  navigation: NavigationProp<RootStackParamList>;
}

export const Game = ({ navigation }: IGame) => {
  // const [location, setLocation] =
  //   React.useState<Location.LocationObject | null>(null);
  const [isLoadingGame, setIsLoadingGame] = React.useState(false);
  const [isFirebaseLoading, setIFirebaseLoading] = React.useState(false);
  const context: any = React.useContext(AppContext);
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [newScrumble, setNewScrumble] = React.useState<IScrumble>({
    scrumble: 'Game starting shortly',
    gameID: 0,
  });
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(
    appState.current
  );

  function _handleAppStateChange(nextAppState: AppStateStatus) {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  }

  React.useEffect(() => {
    let watchLocation: any = null;
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    );

    (async () => {
      setIsLoadingGame(true);
      if (appState.current === 'active') {
        const permission = await Location.getForegroundPermissionsAsync();
        const camera = await getCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Oops!!!',
            'Location permissions required please go to setting and enable location permission'
          );
          setIsLoadingGame(false);
          return;
        }

        if (!camera.granted) {
          Alert.alert(
            'Oops!!!',
            'Camera permissions required please go to setting and enable camera permission'
          );
          setIsLoadingGame(false);
          return;
        }
      }

      const { coords } = context.global.user.location;

      watchLocation = await Location.watchPositionAsync(
        {
          // Tracking options
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
        },
        async (location) => {
          if (location) {
            const game = new GameService();
            let pdis = getPreciseDistance(
              { latitude: coords.latitude, longitude: coords.longitude },
              {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            );

            if (pdis > 500) {
              // await game.suspendAccount(context.global.user.idNumber);
              // navigation.navigate('Signin');
              // Alert.alert(
              //   'Location change has been detected your account has been suspend'
              // );
              // return watchLocation.remove();
            }
            console.log('locationlocation ', pdis);
          }
        }
      );
      setIsLoadingGame(false);
      // let location = await Location.getBackgroundPermissionsAsync();
      // setLocation(location);
    })();
    return async () => {
      await watchLocation.remove();
      // @ts-ignore
      await subscription.removeEventListener();
    };
  }, [appStateVisible]);

  React.useLayoutEffect(() => {
    let unsub: any = '';

    (async function () {
      setIFirebaseLoading(true);
      const { channelName } = context.global.user;

      const ref = collection(db, channelName);
      unsub = onSnapshot(
        query(ref, orderBy('createdAt', 'desc')),
        async (querySnapshot) => {
          const chats: IMessage[] = [];

          querySnapshot.forEach((doc) => {
            if (typeof doc.data()?.text === 'string') {
              chats.push({
                _id: doc.data()?._id,
                createdAt: doc.data()?.createdAt.toDate(),
                text: doc.data()?.text,
                user: doc.data()?.user,
              });
            } else {
              setNewScrumble({
                scrumble: doc.data().text.scrumble,
                gameID: doc.data().text.gameID,
              });
            }
          });

          setMessages(chats);
        }
      );
      setIFirebaseLoading(false);
    })();

    return unsub;
  }, []);

  const onSend = React.useCallback(
    async (messages: IMessage[] = [], newScrumble: any) => {
      try {
        const { channelName, idNumber } = context.global.user;
        const { _id, createdAt, text, user } = messages[0];

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );

        await setDoc(doc(db, channelName, _id.toString()), {
          _id,
          createdAt,
          text,
          user,
        });

        const game = new GameService();

        const res = await game.allocatePoints({
          gameID: newScrumble.gameID,
          idNumber,
          answer: text,
        });

        if (res.success) {
        } else {
          console.log('error ', res);
        }
      } catch (err) {
        console.log('Something went wrong ', err);
      }
    },
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <View style={{ width: 120, height: 220 }}>
          <FaceRecognation
            suspendAccount={async (val: any) => {
              const game = new GameService();

              console.log('val ', val)
              if (val) {
                // await game.suspendAccount(context.global.user.idNumber);
                // navigation.navigate('Signin');
                // Alert.alert(
                //   'Face change has been detected your account has been suspend'
                // );
              } else {
                // if (context.global.user.idNumber !== val) {
                //   await game.suspendAccount(context.global.user.idNumber);
                //   navigation.navigate('Signin');
                //   Alert.alert(
                //     'Face change has been detected your account has been suspend'
                //   );
                // }
              }
              console.log('val ', val);
            }}
          />
        </View>
        <View style={styles.anagramContainer}>
          <Text style={styles.anagram}>{newScrumble.scrumble}</Text>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages, newScrumble)}
        user={{
          _id: context.global.user.idNumber,
          name: context.global.user.firstName,
          avatar: 'https://placeimg.com/140/140/any',
        }}
      />
      {/* <Loader
        modalVisible={isLoadingGame || isFirebaseLoading}
        animationType='fade'
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  anagramContainer: {
    borderRadius: 20,
    backgroundColor: colors.green01,
    width: 150,
    height: 30,
    alignSelf: 'center',
    marginLeft: 50,
    justifyContent: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginTop: 10,
    zIndex: 9999,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  anagram: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.white,
  },
});
