import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './src/navigations/Screens';

export default function App() {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}
