import React from 'react';
import {Text} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

export const Biomatric = () => {
  function biometricKeysExist() {
    ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
      const {keysExist} = resultObject;

      if (keysExist) {
        console.log('Keys exist');
      } else {
        console.log('Keys do not exist or were deleted');
      }
    });
  }

  async function isBiometricSupport() {
    let {success, error} = await ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Sign in with Touch ID',
      cancelButtonText: 'Close',
    });
    console.log({success, error});
  }

  React.useEffect(() => {
    (async () => {
      const {available, biometryType} =
        await ReactNativeBiometrics.isSensorAvailable();

      // console.log('available ', available, ' biometryType ', biometryType);
      if (available && biometryType === ReactNativeBiometrics.Biometrics) {
        console.log('Biometrics is supported', biometryType);
        biometricKeysExist()
        // await isBiometricSupport();
      }
    })();
  }, []);

  console.log('logger');
  return <Text style={{fontSize: 12, color: 'red'}}>Hello there</Text>;
};
