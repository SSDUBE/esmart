import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { AppContext } from '../context/context';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

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

  React.useEffect(() => {
    (function () {
      // const is = socket.connect()
      // console.log('issss ', is)
    })();

    socket.on('chat message', (msg = []) => {
      console.log('msg ', msg);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, msg)
      );
      // setMessages([
      //   {
      //     _id: msg._id,
      //     text: msg.text,
      //     createdAt: msg.createdAt,
      //     user: {
      //       _id: msg.user._id,
      //       name: 'React Native',
      //       avatar: 'https://placeimg.com/140/140/any',
      //     },
      //   },
      // ]);
      // setChatMsgs([...chatMsgs, msg]);
    });
  }, []);

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

  function onSend(messages: IMessage[] = []) {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    socket.emit('chat message', messages);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{ _id: context.global.user.idNumber }}
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
