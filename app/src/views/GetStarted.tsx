import React from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';

// galio component
import { Block, Button, Input, NavBar, Text } from 'galio-framework';
import theme from '../constants/Theme';
import { Welcome } from '../constants/Images';

const { height, width } = Dimensions.get('window');

export const GetStarted = (props: any) => {
  // function handleChange(name, value) {
  //   this.setState({ [name]: value });
  // }

  const { navigation } = props;
  // const { email, password } = this.state;

  return (
    <Block safe flex style={{ backgroundColor: theme.COLORS.WHITE }}>
      <Text h4 center style={{ marginTop: theme.SIZES.BASE * 4 }}>
        Esmart
      </Text>
      <Block flex center>
        <Image
          source={Welcome}
          style={{
            height: theme.SIZES.BASE * 15,
            width: theme.SIZES.BASE * 20,
            marginTop: theme.SIZES.BASE * 4,
            borderRadius: 20,
          }}
        />
      </Block>
      <Block
        flex
        center
        style={{
          marginTop: theme.SIZES.BASE * 23,
        }}
      >
        <Text
          muted
          center
          size={theme.SIZES.FONT * 0.89}
          style={{ paddingHorizontal: theme.SIZES.BASE * 2.3 }}
        >
          Pupils ESmart Learning Game
        </Text>
      </Block>

      <Block flex={2} center>
        <Block flex middle>
          <Button round color='error' onPress={() => navigation.navigate('Login')}>
            Get Started
          </Button>
        </Block>
      </Block>
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
