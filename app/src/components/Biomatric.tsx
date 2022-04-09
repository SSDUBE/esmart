import React from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Text, Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';
import keypair from 'keypair';

export const Biomatric = () => {
  const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);

  // Check if biomatrics are served on user device
  // async function handleBiometricAuth() {
  //   const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
  //   console.log('savedBiometrics ', savedBiometrics)
  //   if (!savedBiometrics) {
  //     return Alert.alert(
  //       'Biometric record not found',
  //       'Please verify your identity with your password',
  //       // () => fallBackToDefaultAuth()
  //     );
  //   }

  //   const biometricAuth = await LocalAuthentication.authenticateAsync({
  //     promptMessage: 'Login with Biometrics',
  //     disableDeviceFallback: true,
  //   });

  //   console.log('biometricAuth ', biometricAuth)
  // };

  React.useEffect(() => {
    (async () => {
      const isBiomatricSupported = await LocalAuthentication.hasHardwareAsync();

      console.log('testing ', isBiomatricSupported);
      if (isBiomatricSupported) {
        const isSaveBiomatric = await LocalAuthentication.isEnrolledAsync();

        if (isSaveBiomatric) {
          let result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Scan your finger.'
          });
          const pair = keypair();
          console.log('hello there ', pair);
        }
        //do something fingerprint specific
      }
    })();
  });

  return <Text style={{ marginTop: 50 }}>hello there</Text>;
};
