import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  GetStarted: undefined;
  Signin: undefined;
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList, 'GetStarted'>;
