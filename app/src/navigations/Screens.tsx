import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { GetStarted } from '../views/GetStarted';
import { Home } from '../views/Home';
import { Signin } from '../views/Signin';
import { NavigationProps } from './RootStackParamList';
import { LeaderBoard } from '../views/LeaderBoard';
import { Profile } from '../views/Profile';
import { Game } from '../views/Game';
import { AppProvider } from '../context/context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Leader Board' component={LeaderBoard} />
      <Tab.Screen name='Profile' component={Profile} />
      <Tab.Screen name='Logout' component={Home} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='GetStarted' component={GetStarted} />
      <Stack.Screen name='Signin' component={Signin} />
    </Stack.Navigator>
  );
}

export const AppStack = () => {
  return (
    <AppProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name='AuthStack' component={AuthStack} /> */}
        <Stack.Screen name='HomeStack' component={HomeStack} />
        <Stack.Screen name='Game' component={Game} />
      </Stack.Navigator>
    </AppProvider>
  );
};

const styles = StyleSheet.create({});
