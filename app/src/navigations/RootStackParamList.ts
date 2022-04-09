import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList, 'GetStarted'>;
