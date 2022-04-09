import React, { FunctionComponent } from 'react';
import Icon from '@expo/vector-icons/FontAwesome';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../constants/Colors';

interface IInputField {
  labelText: string;
  labelTextSize?: number;
  labelColor?: string;
  textColor?: string;
  borderBottomColor?: string;
  inputType: string;
  customStyle?: any;
  onChangeText: (text: string) => void;
  showCheckmark: boolean;
  autoFocus?: boolean;
  autoCapitalize?: any;
  labelTextWeight?:
    | '700'
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '800'
    | '900'
    | undefined;
  inputStyle?: any;
  placeholder?: string;
  defaultValue?: string;
}

export const InputField: FunctionComponent<IInputField> = ({
  labelText,
  labelTextSize,
  labelTextWeight,
  labelColor,
  textColor,
  borderBottomColor,
  inputType,
  customStyle,
  inputStyle,
  onChangeText,
  showCheckmark,
  autoFocus,
  autoCapitalize,
  placeholder,
  defaultValue,
}) => {
  const [secureInput, setSecureInput] = React.useState(
    !(inputType === 'text' || inputType === 'email')
  );
  const [scaleCheckmarkValue, setScaleCheckmarkValue] = React.useState(
    new Animated.Value(0)
  );
  const [inputValue, setInputValue] = React.useState(defaultValue);

  function scaleCheckmark(value: number) {
    // @ts-ignore
    Animated.timing(scaleCheckmarkValue, {
      useNativeDriver: false,
      toValue: value,
      duration: 400,
      // easing: Easing.easeOutBack,
    }).start();
  }

  function toggleShowPassword() {
    setSecureInput(!secureInput);
  }

  function handleChangeText(text: string) {
    onChangeText(text);
    setInputValue(text);
  }

  const fontSize = labelTextSize || 14;
  const fontWeight = labelTextWeight || '700';
  const color = labelColor || colors.white;
  const inputColor = textColor || colors.white;
  const borderBottom = borderBottomColor || 'transparent';
  const keyboardType = inputType === 'email' ? 'email-address' : 'default';
  const customInputStyle = inputStyle || {};
  if (!inputStyle || (inputStyle && !inputStyle.paddingBottom)) {
    customInputStyle.paddingBottom = 5;
  }

  const iconScale = scaleCheckmarkValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.01, 1.6, 1],
  });

  const scaleValue = showCheckmark ? 1 : 0;
  scaleCheckmark(scaleValue);

  return (
    <View style={[customStyle, styles.wrapper]}>
      <Text style={[{ fontWeight, color, fontSize }, styles.label]}>
        {labelText}
      </Text>
      {inputType === 'password' ? (
        <TouchableOpacity
          style={styles.showButton}
          onPress={toggleShowPassword}
        >
          <Text style={styles.showButtonText}>
            {secureInput ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      ) : null}
      <Animated.View
        style={[{ transform: [{ scale: iconScale }] }, styles.checkmarkWrapper]}
      >
        <Icon name='check' color={colors.white} size={20} />
      </Animated.View>
      <TextInput
        style={[
          { color: inputColor, borderBottomColor: borderBottom },
          inputStyle,
          styles.inputField,
        ]}
        secureTextEntry={secureInput}
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        underlineColorAndroid='transparent'
        placeholder={placeholder}
        defaultValue={inputValue}
        value={inputValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
  },
  label: {
    marginBottom: 20,
  },
  inputField: {
    borderBottomWidth: 1,
    paddingTop: 5,
  },
  showButton: {
    position: 'absolute',
    right: 0,
  },
  showButtonText: {
    color: colors.white,
    fontWeight: '700',
  },
  checkmarkWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
});
