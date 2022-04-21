import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { colors } from '../constants/Colors';
import { iPhoneSize } from '../constants/IphoneSize';
import { RoundedButton } from '../components/RoundedButton';

const esmartLogo = require('../../assets/img/esmart-logo.png');

export const GetStarted = (props: any) => {

  const { navigation } = props;
  // const { email, password } = this.state;

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.welcomeWrapper}>
        <Image source={esmartLogo} style={styles.logo} />
        <Text style={styles.welcomeText}>Welcome to Esmart.</Text>
        <RoundedButton
          text='Get Started'
          textColor={colors.white}
          handleOnPress={() => navigation.navigate('Signin')}
        />

        {/* <TouchableHighlight
          style={styles.moreOptionsButton}
          onPress={() => {}}
        >
          <Text style={styles.moreOptionsButtonText}>More options</Text>
        </TouchableHighlight> */}
        <View style={styles.termsAndConditions}>
          <Text style={styles.termsText}>
            By tapping Continue, Create Account or More
          </Text>
          <Text style={styles.termsText}>{' options,'}</Text>
          <Text style={styles.termsText}>{"I agree to Esmart's "}</Text>
          <TouchableHighlight style={styles.linkButton}>
            <Text style={styles.termsText}>Terms of Service</Text>
          </TouchableHighlight>
          <Text style={styles.termsText}>,</Text>
          <TouchableHighlight style={styles.linkButton}>
            <Text style={styles.termsText}>Payments Terms of Service</Text>
          </TouchableHighlight>
          <Text style={styles.termsText}>,</Text>
          <TouchableHighlight style={styles.linkButton}>
            <Text style={styles.termsText}>Privacy Policy</Text>
          </TouchableHighlight>
          <Text style={styles.termsText}>, and</Text>
          <TouchableHighlight style={styles.linkButton}>
            <Text style={styles.termsText}>Nondiscrimination Policy</Text>
          </TouchableHighlight>
          <Text style={styles.termsText}>.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

let termsTextSize = 13;
let headingTextSize = 30;
if (iPhoneSize() === 'small') {
  termsTextSize = 12;
  headingTextSize = 26;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    display: 'flex',
    backgroundColor: colors.green01,
  },
  welcomeWrapper: {
    flex: 1,
    display: 'flex',
    marginTop: 30,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginTop: 50,
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: headingTextSize,
    color: colors.white,
    fontWeight: '300',
    marginBottom: 200,
  },
  facebookButtonIcon: {
    color: colors.green01,
    position: 'relative',
    left: 20,
    zIndex: 8,
  },
  moreOptionsButton: {
    marginTop: 10,
  },
  moreOptionsButtonText: {
    color: colors.white,
    fontSize: 16,
  },
  termsAndConditions: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 30,
  },
  termsText: {
    color: colors.white,
    fontSize: termsTextSize,
    fontWeight: '600',
  },
  linkButton: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
});
