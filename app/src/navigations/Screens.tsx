import {
 StyleSheet
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { GetStarted } from '../views/GetStarted';
import { Home } from '../views/Home';
import { Login } from '../views/Login';
import { NavigationProps } from './RootStackParamList';
import { LeaderBoard } from '../views/LeaderBoard';
import { Profile } from '../views/Profile';
import { Game } from '../views/Game';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Leader Board" component={LeaderBoard} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Logout" component={Home} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='GetStarted' component={GetStarted} />
      <Stack.Screen name='Login' component={Login} />
    </Stack.Navigator>
  );
}

export const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name='AuthStack' component={AuthStack} /> */}
      <Stack.Screen name='HomeStack' component={HomeStack} />
      <Stack.Screen name='Game' component={Game} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
});
