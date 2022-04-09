import {
 StyleSheet
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { GetStarted } from '../views/GetStarted';
import { Home } from '../views/Home';
import { Login } from '../views/Login';
import { NavigationProps } from './RootStackParamList';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Game" component={Home} />
      <Tab.Screen name="Profile" component={Home} />
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
});
