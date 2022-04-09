import React, { FunctionComponent } from 'react';
import Icon from '@expo/vector-icons/FontAwesome';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
  Animated,
} from 'react-native';
import { colors } from '../constants/Colors';

interface INotification {
  showNotification: boolean;
  type: string;
  firstLine?: string;
  secondLine?: string;
  handleCloseNotification: () => void;
}

export const Notification: FunctionComponent<INotification> = ({
  handleCloseNotification,
  type,
  firstLine,
  secondLine,
  showNotification,
}) => {
  const [positionValue, setPositionValue] = React.useState(
    new Animated.Value(-60)
  );

  function animateNotification(value: number) {
    Animated.timing(positionValue, {
      useNativeDriver: false,
      toValue: value,
      duration: 300,
      // @ts-ignore
      velocity: 3,
      tension: 2,
      friction: 8,
      // @ts-ignore
      easing: Easing.easeOutBack,
    }).start();
  }

  showNotification
    ? animateNotification(0)
    : animateNotification(-60);
  return (
    <Animated.View style={[{ marginBottom: positionValue }, styles.wrapper]}>
      <View style={styles.errorMessageContainer}>
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{type}</Text>
          <Text>{firstLine}</Text>
        </View>
        <Text style={styles.errorMessage}>{secondLine}</Text>
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleCloseNotification}
      >
        <Icon name='times' size={20} color={colors.lightGray} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.white,
    height: 60,
    padding: 10,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  errorText: {
    color: colors.darkOrange,
    marginRight: 5,
    fontSize: 14,
    marginBottom: 2,
  },
  errorMessage: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 2,
    fontSize: 14,
  },
  errorMessageContainer: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 2,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 999,
  },
});
