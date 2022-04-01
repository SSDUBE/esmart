import React from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
} from 'react-native';

// galio component
import { Block, Button, Input, NavBar, Text } from 'galio-framework';
import theme from '../constants/Theme';

const { height, width } = Dimensions.get('window');

export const Login = (props: any) => {
  // function handleChange(name, value) {
  //   this.setState({ [name]: value });
  // }

  const { navigation } = props;
  // const { email, password } = this.state;

  return (
    <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
      <NavBar
        title='Sign In'
        style={
          Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null
        }
      />
      <KeyboardAvoidingView style={styles.container} behavior='height' enabled>
        <Block
          flex
          center
          style={{
            marginTop: theme.SIZES.BASE * 1.875,
            marginBottom: height * 0.1,
          }}
        >
          <Text
            muted
            center
            size={theme.SIZES.FONT * 0.875}
            style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}
          >
            To sign in please fill in the form below and click submit
          </Text>
        </Block>

        <Block flex={2} center space='evenly'>
          <Block flex={2}>
            <Input
              rounded
              type='email-address'
              placeholder='Email'
              autoCapitalize='none'
              style={{ width: width * 0.9 }}
              // onChangeText={(text) => this.handleChange('email', text)}
            />
            <Input
              rounded
              password
              viewPass
              placeholder='Password'
              style={{ width: width * 0.9 }}
              // onChangeText={(text) => this.handleChange('password', text)}
            />
            <Text
              color={theme.COLORS.ERROR}
              size={theme.SIZES.FONT * 0.75}
              onPress={() =>
                Alert.alert(
                  'Please contact your teacher with assistance to reset your password'
                )
              }
              style={{
                alignSelf: 'flex-end',
                lineHeight: theme.SIZES.FONT * 2,
              }}
            >
              Forgot your password?
            </Text>
          </Block>
          <Block flex middle>
            <Button
              round
              color='error'
              onPress={() => {
                navigation.navigate('Home');
              }}
            >
              Sign in
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: theme.SIZES.BASE * 0.3,
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: theme.COLORS.WHITE,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
  },
});
