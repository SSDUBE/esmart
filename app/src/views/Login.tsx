import React, { FunctionComponent } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import { InputField } from '../components/InputField';
import { Loader } from '../components/Loader';
import { NextArrowButton } from '../components/NextArrowButton';
import { Notification } from '../components/Notification';
import { colors } from '../constants/Colors';
import { iPhoneSize } from '../constants/IphoneSize';

interface ILogin {
  login: any;
  navigation: any;
}

export const Login: FunctionComponent<ILogin> = ({ login, navigation }) => {
  const [formValid, setFormValid] = React.useState(true);
  const [loadingVisible, setLoadingVisible] = React.useState(false);
  const [validEmail, setValidEmail] = React.useState(false);
  const [validPassword, setValidPassword] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState(false);
  const [password, setPassword] = React.useState(false);

  function handleNextButton() {
    setLoadingVisible(true);
    const { navigate } = navigation;

    setTimeout(() => {
      if (login(emailAddress, password)) {
        setFormValid(true);
        setLoadingVisible(false);
        // navigate('TurnOnNotifications');
      } else {
        setFormValid(false);
        setLoadingVisible(false);
      }
    }, 2000);
  }

  function toggleNextButtonState() {
    if (validEmail && validPassword) {
      return false;
    }
    return true;
  }

  function handleCloseNotification() {
    setFormValid(true);
  }

  const showNotification = !formValid;
  const background = formValid ? colors.green01 : colors.darkOrange;
  const notificationMarginTop = showNotification ? 10 : 0;

  return (
    <KeyboardAvoidingView
      style={[{ backgroundColor: background }, styles.wrapper]}
      behavior='padding'
    >
      <View style={styles.scrollViewWrapper}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.loginHeader}>Log In</Text>
          <InputField
            labelText='EMAIL ADDRESS'
            labelTextSize={14}
            labelColor={colors.white}
            textColor={colors.white}
            borderBottomColor={colors.white}
            inputType='email'
            customStyle={{ marginBottom: 30 }}
            onChangeText={() => {}}
            showCheckmark={validEmail}
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
            onChangeText={() => {}}
            showCheckmark={validPassword}
          />
        </ScrollView>
        <NextArrowButton
          handleNextButton={handleNextButton}
          disabled={toggleNextButtonState()}
        />
      </View>
      <Loader modalVisible={loadingVisible} animationType='fade' />
      <View
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
      </View>
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
