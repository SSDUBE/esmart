import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Alert,
  AppState,
  AppStateStatus,
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
// @ts-ignore
import RewardsComponent from 'react-native-rewards';

interface IScrumble {
  scrumble: string;
  gameId: number;
}

export const Game = () => {
  const context: any = React.useContext(AppContext);
  const [animationState, setAnimationState] = React.useState('rest');
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [newScrumble, setNewScrumble] = React.useState<IScrumble>({
    scrumble: 'Game starting shortly',
    gameId: 0,
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
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    );

    (async () => {
      if (appState.current === 'active') {
        const permission = await Location.getForegroundPermissionsAsync();
        const camera = await getCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Oops!!!',
            'Location permissions required please go to setting and enable location permission'
          );
          return;
        }

        if (!camera.granted) {
          Alert.alert(
            'Oops!!!',
            'Camera permissions required please go to setting and enable camera permission'
          );
          return;
        }
      }
    })();

    // return () => {
    //   // @ts-ignore
    //   subscription.removeEventListener();
    // };
  }, [appStateVisible]);

  React.useLayoutEffect(() => {
    let unsub: any = '';

    (async function () {
      const { channelName } = context.global.user;

      const ref = collection(db, channelName);
      unsub = onSnapshot(
        query(ref, orderBy('createdAt', 'desc')),
        async (querySnapshot) => {
          const chats: IMessage[] = [];

          querySnapshot.forEach((doc) => {
            // console.log('doc ', doc.data()?.text);
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
                gameId: doc.data().text.gameID,
              });
            }
          });

          setMessages(chats);
        }
      );
    })();

    return unsub;
  }, []);

  const onSend = React.useCallback(async (messages: IMessage[] = []) => {
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
        gameID: newScrumble.gameId,
        idNumber,
        answer: text,
      });

      if (res.correct) {
        setAnimationState('reward')
      }
    } catch (err) {
      console.log('Something went wrong ', err);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <View style={{ width: 120, height: 220 }}>
          <FaceRecognation />
        </View>
        <View style={styles.anagramContainer}>
          <Text style={styles.anagram}>{newScrumble.scrumble}</Text>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: context.global.user.idNumber,
          name: context.global.user.firstName,
          avatar: 'https://placeimg.com/140/140/any',
        }}
      />
      <RewardsComponent
        animationType='confetti'
        state={animationState}
        onRest={() => setAnimationState('rest')}
      />
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
