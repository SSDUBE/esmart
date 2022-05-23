import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { AppContext } from '../context/context';
import { GiftedChat } from 'react-native-gifted-chat';

const socket = io('http://192.168.101.201:4000');

interface IMessage {
  _id: number;
  text: string;
  createdAt: Date;
  user: {
    _id: number;
    name: string;
    avatar: string;
  };
}

export const Game = () => {
  const context = React.useContext(AppContext);
  // const [chatMsg, setChatMsg] = React.useState('');
  // const [chatMsgs, setChatMsgs] = React.useState<any>([]);

  const [messages, setMessages] = React.useState<IMessage[]>([]);

  React.useEffect(() => {
    socket.on('chat message', (msg) => {
      console.log('msg ', msg)
      setMessages([...msg]);
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

  const onSend = React.useCallback((messages = []) => {
    setMessages((previousMessages) => {
      socket.emit('chat message', messages)
      return GiftedChat.append(previousMessages, messages)
    });
    // socket.emit('chat message', messages)
  }, []);

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
        scrollToBottom
        infiniteScroll
        // loadEarlier
        alwaysShowSend
        // renderUsernameOnMessage
        inverted={true}
        // showUserAvatar
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
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
