import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
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

export const Game = () => {
  const context: any = React.useContext(AppContext);
  const [messages, setMessages] = React.useState<IMessage[]>([]);

  React.useLayoutEffect(() => {
    let unsub: any = '';

    (async function () {
      const ref = collection(db, 'chats');
      unsub = onSnapshot(
        query(ref, orderBy('createdAt', 'desc')),
        async (querySnapshot) => {
          const chats: IMessage[] = [];

          querySnapshot.forEach((doc) => {
            console.log('doc ', doc.data()?.text);
            if (typeof doc.data()?.text === 'string') {
              chats.push({
                _id: doc.data()?._id,
                createdAt: doc.data()?.createdAt.toDate(),
                text: doc.data()?.text,
                user: doc.data()?.user,
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
      const { _id, createdAt, text, user } = messages[0];

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      await setDoc(doc(db, 'chats', _id.toString()), {
        _id,
        createdAt,
        text,
        user,
      });
    } catch (err) {
      console.log('Something went wrong ', err);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ width: 120, height: 220 }}>
        <FaceRecognation />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
});
