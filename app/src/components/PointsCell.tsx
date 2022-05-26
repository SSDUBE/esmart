// @ts-nocheck

import React, { Component } from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('screen');

export class PointsCell extends Component {
  static propTypes = {
    value: PropTypes.number,
    coinAndPointsCircleStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    pointsTextStyle: PropTypes.object,
    coinAndTextView: PropTypes.object,
    coinCircleStyle: PropTypes.object,
    imageStyle: PropTypes.object,
    textView: PropTypes.object,
    onPress: PropTypes.func,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  render() {
    const {
      value,
      coinAndPointsCircleStyle,
      pointsTextStyle,
      valueText,
      textView,
      coinAndTextView,
      coinCircleStyle,
      imageStyle,
      onPress = () => null,
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[styles.circle, coinAndPointsCircleStyle]}>
          <View style={[styles.coinAndPoints, coinAndTextView]}>
            <ImageBackground style={[styles.coinCircle, coinCircleStyle]}>
              <Image
                style={[{ height: 30, width: 30 }, imageStyle]}
                resizeMode='contain'
                source={require('../../assets/img/Pineapple_Coin3x.png')}
              />
            </ImageBackground>
            <View style={[styles.rewardBalanceView, textView]}>
              {!value && value !== 0 ? (
                <ActivityIndicator
                  style={{ marginVertical: 12 }}
                  color={'black'}
                />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.points, pointsTextStyle]}>{value}</Text>
                  <Text style={styles.ptsText}>{valueText}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  points: {
    fontSize: width / 12,
    fontFamily: 'Montserrat-Light',
  },
  circle: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: width / 8,
    borderRadius: 25,
  },
  coinAndPoints: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: width / 30,
    marginRight: width / 15,
  },
  coinCircle: {
    height: 27,
    width: 27,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardBalanceView: {
    left: width / 35,
    flexDirection: 'row',
  },
  ptsText: {
    top: 1,
    fontSize: width / 45,
    lineHeight: width / 11,
    fontFamily: 'Montserrat-Light',
  },
});
