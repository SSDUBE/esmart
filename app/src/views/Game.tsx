import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { AppContext } from '../context/context';

const socket = io('http://192.168.8.127:4000');

export const Game = () => {
  const context = React.useContext(AppContext)
  const [chatMsg, setChatMsg] = React.useState('');
  const [chatMsgs, setChatMsgs] = React.useState<any>([]);

  React.useEffect(() => {
    (function () {
      // const is = socket.connect()
      // console.log('issss ', is)
      
    })();

    socket.on('chat message', (msg) => {
      setChatMsgs([...chatMsgs, msg]);
    });
  }, []);

  function submitChagMsg() {
    socket.emit('chat message', chatMsg);
    setChatMsg('');
  }

  const chatMessages = chatMsgs.map((msg: string, i: number) => (
    <Text key={i}>{msg}</Text>
  ));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={{ height: 40, borderWidth: 2, marginTop: 50 }}
          autoCorrect={false}
          value={chatMsg}
          onSubmitEditing={submitChagMsg}
          onChangeText={(msg) => setChatMsg(msg)}
        />
        {chatMessages}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
});
