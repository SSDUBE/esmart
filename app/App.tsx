import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AppStack } from './app/navigations/Screens';
import { Block, GalioProvider } from 'galio-framework';
import theme from './app/constants/Theme';

export default function App() {
  return (
    <NavigationContainer>
      <GalioProvider theme={theme}>
        <Block flex>
          <AppStack />
        </Block>
      </GalioProvider>
    </NavigationContainer>
  );
}
