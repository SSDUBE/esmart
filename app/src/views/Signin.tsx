import React, { FunctionComponent, useContext } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { InputField } from '../components/InputField';
import { Loader } from '../components/Loader';
import { NextArrowButton } from '../components/NextArrowButton';
import { Notification } from '../components/Notification';
import { colors } from '../constants/Colors';
import { iPhoneSize } from '../constants/IphoneSize';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Keychain from 'react-native-keychain';
import keypair from 'keypair';
import { AuthService } from '../services/AuthService';
import { AppContext } from '../context/context';

interface ISignin {
  login: any;
  navigation: any;
}

const ValidationSchema = Yup.object().shape({
  idNumber: Yup.string()
    .required('ID Number is a required field')
    .matches(
      /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))/,
      'Please enter a valid ID number'
    )
    .min(13, 'ID number must contain a minimum of 13 digits')
    .max(13, 'ID number must contain a minimum of 13 digits'),
  password: Yup.string().required('Password is required'),
});

export const Signin: FunctionComponent<ISignin> = ({ login, navigation }) => {
  const context: any = React.useContext(AppContext);

  const [formValid, setFormValid] = React.useState(true);

  function handleCloseNotification() {
    setFormValid(true);
  }

  function biomatric(values: any, setSubmitting: any) {
    (async () => {
      const isBiomatricSupported = await LocalAuthentication.hasHardwareAsync();

      if (isBiomatricSupported) {
        const isSaveBiomatric = await LocalAuthentication.isEnrolledAsync();

        if (isSaveBiomatric) {
          let result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Scan your finger.',
          });
          if (result) {
            const pair = keypair();
            const auth = new AuthService();
            const res = await auth.signinUser(values);

            console.log('res::: ', res);
            if (res.success) {
              // context.user.update(res.data);
              // TODO to dispatch actions to context
              context.user.update(res.data);
              navigation.navigate('HomeStack');
            } else {
              Alert.alert('Oops!!!', res.message);
            }
          } else {
            Alert.alert('Failed to validate finger print');
          }
        } else {
          Alert.alert('Ooops!!', 'Please add finger print to your device');
        }
        //do something fingerprint specific
      } else {
        Alert.alert('Oops!!!', 'Device does not have biomatric');
      }
    })();
  }

  const showNotification = !formValid;
  const background = formValid ? colors.green01 : colors.darkOrange;
  const notificationMarginTop = showNotification ? 10 : 0;

  return (
    <KeyboardAvoidingView
      style={[{ backgroundColor: background }, styles.wrapper]}
      behavior='padding'
    >
      <Formik
        initialValues={{ idNumber: '', password: '' }}
        validationSchema={ValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true);
            await biomatric(values, setSubmitting);
          } catch (err) {
            console.log('err ', err);
            Alert.alert('Oops!!!', 'Something went wrong please try again');
            setSubmitting(false);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <View style={styles.scrollViewWrapper}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.loginHeader}>Sign in</Text>
              <InputField
                labelText='ID NUMBER'
                labelTextSize={14}
                labelColor={colors.white}
                textColor={colors.white}
                borderBottomColor={colors.white}
                inputType='email'
                customStyle={{ marginBottom: 30 }}
                onChangeText={(val) => setFieldValue('idNumber', val)}
                showCheckmark={errors.idNumber ? true : false}
                error={errors.idNumber}
                autoFocus
              />
              <InputField
                labelText='PASSWORD'
                labelTextSize={14}
                labelColor={colors.white}
                textColor={colors.white}
                borderBottomColor={colors.white}
                inputType='password'
                customStyle={{ marginBottom: 30 }}
                onChangeText={(val) => setFieldValue('password', val)}
                showCheckmark={!errors.password ? true : false}
                error={errors.password}
              />
            </ScrollView>
            <NextArrowButton handleNextButton={handleSubmit} />
            <Loader modalVisible={isSubmitting} animationType='fade' />
          </View>
        )}
      </Formik>
      {/* <View
        style={[
          styles.notificationWrapper,
          { marginTop: notificationMarginTop },
        ]}
      >
        <Notification
          showNotification={showNotification}
          handleCloseNotification={handleCloseNotification}
          type='Error'
          firstLine="Those credentials don't look right."
          secondLine='Please try again.'
        />
      </View> */}
    </KeyboardAvoidingView>
  );
};

let headingTextSize = 30;
if (iPhoneSize() === 'small') {
  headingTextSize = 26;
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flex: 1,
  },
  scrollViewWrapper: {
    marginTop: 70,
    flex: 1,
    padding: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 20,
    flex: 1,
  },
  loginHeader: {
    fontSize: headingTextSize,
    color: colors.white,
    fontWeight: '300',
    marginBottom: 40,
  },
  notificationWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
