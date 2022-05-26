import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { io, Socket } from 'socket.io-client';
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
  limit,
  collection,
  getDocs,
} from 'firebase/firestore';

const socket = io('http://192.168.8.127:4000');

// interface IMessage {
//   _id: number;
//   text: string;
//   createdAt: Date;
//   user: {
//     _id: number;
//     name: string;
//     avatar: string;
//   };
// }

export const Game = () => {
  const context: any = React.useContext(AppContext);
  // const [chatMsg, setChatMsg] = React.useState('');
  // const [chatMsgs, setChatMsgs] = React.useState<any>([]);

  const [messages, setMessages] = React.useState<IMessage[]>([]);

  // React.useEffect(() => {
  //   // socket.on('chat message', (message = []) => {
  //   //   const tempMsg = [...messages];
  //   //   const msg = message[0];
  //   //   console.log('msg ', msg.user);

  //   //   if (msg) {
  //   //     tempMsg.push({
  //   //       _id: msg._id,
  //   //       text: msg.text,
  //   //       createdAt: msg.createdAt,
  //   //       user: {
  //   //         _id: msg.user._id,
  //   //         name: 'React Native',
  //   //         avatar: 'https://placeimg.com/140/140/any',
  //   //       },
  //   //     });

  //   //     setMessages(tempMsg);
  //   //   }
  //   // });
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         _id: 2,
  //         name: 'React Native',
  //         avatar: 'https://placeimg.com/140/140/any',
  //       },
  //     },
  //   ]);
  // }, []);

  function submitChagMsg() {
    // socket.emit('chat message', chatMsg);
    // setChatMsg('');
  }

  // const chatMessages = chatMsgs.map((msg: string, i: number) => (
  //   <Text key={i}>{msg}</Text>
  // ));

  // const onSend = async (msg: IMessage[] = []) => {
  //   const newMessages = await GiftedChat.append(messages, msg)

  //   console.log('newMessages ', newMessages)
  //   console.log('messages ', messages)

  //   setMessages(newMessages);
  //   socket.emit('chat message', messages[0]);
  // };

  // function onSend(messages: IMessage[] = []) {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages)
  //   );
  //   socket.emit('chat message', messages);
  // }

  React.useLayoutEffect(() => {
    let unsub: any = '';

    (async function () {
      const ref = collection(db, 'chats');
      unsub = onSnapshot(
        query(ref, orderBy('createdAt', 'desc')),
        async (querySnapshot) => {
          const chats: IMessage[] = [];

          querySnapshot.forEach((doc) => {
            chats.push({
              _id: doc.data()?._id,
              createdAt: doc.data()?.createdAt.toDate(),
              text: doc.data()?.text,
              user: doc.data()?.user,
            });
          });

          setMessages(chats)
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
      {/* <FaceRecognation /> */}
      {/* <View style={styles.container}>
        <TextInput
          style={{ height: 40, borderWidth: 2, marginTop: 50 }}
          autoCorrect={false}
          value={chatMsg}
          onSubmitEditing={submitChagMsg}
          onChangeText={(msg) => setChatMsg(msg)}
        />
        {chatMessages}
      </View> */}
      {/* <GiftedChat
        messages={messages}
        // showAvatarForEveryMessage
        onSend={(messages) => onSend(messages)}
        user={{
          _id: context.global.user.idNumber,
          // avatar: 'https://placeimg.com/140/140/any',
        }}
      /> */}
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
