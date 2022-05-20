import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { io } from 'socket.io-client';


const socket = io('http://192.168.8.127:4000');

export const Game = () => {

  React.useEffect(() => {
    (function() {
      // const is = socket.connect()
      // console.log('issss ', is)
    })()
  })
  return (
    <SafeAreaView>
      <Text style={{marginTop: 30}}>Game</Text>
    </SafeAreaView>
  );
};
