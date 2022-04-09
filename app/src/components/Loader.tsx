import React, { FunctionComponent } from 'react';
import { View, Image, Modal, StyleSheet } from 'react-native';
import { colors } from '../constants/Colors';

interface ILoader {
  animationType: 'none' | 'slide' | 'fade' | undefined;
  modalVisible: boolean;
}

export const Loader: FunctionComponent<ILoader> = ({
  animationType,
  modalVisible,
}) => {
  return (
    <Modal animationType={animationType} transparent visible={modalVisible}>
      <View style={styles.wrapper}>
        <View style={styles.loaderContainer}>
          {/* <Image
            style={styles.loaderImage}
            source={require('../../assets/img/greenLoader.gif')}
          /> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  loaderContainer: {
    width: 90,
    height: 90,
    backgroundColor: colors.white,
    borderRadius: 15,
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -45,
    marginTop: -45,
  },
  loaderImage: {
    width: 70,
    height: 70,
    borderRadius: 15,
    position: 'relative',
    left: '50%',
    marginLeft: -35,
    top: '50%',
    marginTop: -35,
  },
});
