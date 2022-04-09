import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';

import { GetStarted } from '../views/GetStarted';
import { Home } from '../views/Home';
import { Login } from '../views/Login';
import { Dimensions } from 'react-native';
import {
  Image, StyleSheet, ScrollView, SafeAreaView, Platform,
} from 'react-native';
import { NavigationProps } from './RootStackParamList';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const { width } = Dimensions.get('screen');

// function GalioDrawer(props: any) {
//   return (
//     <SafeAreaView
//       style={styles.drawer}
//       forceInset={{ top: 'always', horizontal: 'never' }}
//     >
//       <Block space='between' row style={styles.header}>
//         <Block flex={0.3}>
//           <Image
//             source={{ uri: 'http://i.pravatar.cc/100' }}
//             style={styles.avatar}
//           />
//         </Block>
//         <Block flex style={styles.middle}>
//           <Text size={theme.SIZES.FONT * 0.875}>Galio Framework</Text>
//           <Text muted size={theme.SIZES.FONT * 0.875}>
//             React Native
//           </Text>
//         </Block>
//       </Block>
//       <ScrollView>
//         <DrawerItem {...props} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

function HomeStack() {
  return (
    <Drawer.Navigator
      // style={{ flex: 1 }}
      // drawerContent={(props) => <GalioDrawer {...props} />}
      // drawerStyle={{
      //   backgroundColor: 'white',
      //   width: width * 0.8,
      // }}
      // drawerContentOptions={{
      //   activeTintcolor: 'white',
      //   inactiveTintColor: '#000',
      //   activeBackgroundColor: 'transparent',
      //   itemStyle: {
      //     width: width * 0.75,
      //     backgroundColor: 'transparent',
      //     paddingVertical: 16,
      //     paddingHorizonal: 12,
      //     justifyContent: 'center',
      //     alignContent: 'center',
      //     alignItems: 'center',
      //     overflow: 'hidden',
      //   },
      //   labelStyle: {
      //     fontSize: 18,
      //     marginLeft: 12,
      //     fontWeight: 'normal',
      //   },
      // }}
      initialRouteName='Home'
    >
      <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Notifications" component={Home} />
    </Drawer.Navigator>
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
      <Stack.Screen name='AuthStack' component={AuthStack} />
      <Stack.Screen name='HomeStack' component={HomeStack} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
});
