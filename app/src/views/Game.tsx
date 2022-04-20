import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

export const Game = () => {
  return (
    <SafeAreaView>
      <Text>Game</Text>
    </SafeAreaView>
  );
};
