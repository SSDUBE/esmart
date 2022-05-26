import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Dimensions,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
// import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { AppContext } from '../context/context';
import { PointsCell } from '../components/PointsCell';
// import { Maps } from '../components/Maps';
// import { Biomatric } from '../components/Biomatric';
// import { FaceRecognation } from '../components/FaceRecognation';

const borderRadius = 6;
const { height, width } = Dimensions.get('screen');

export const Home = ({ navigation }: any) => {
  const context: any = React.useContext(AppContext);
  const ref = React.useRef(null);
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [mapRegion, setmapRegion] = React.useState({
    latitude: -25.551297,
    longitude: 28.109171,
    latitudeDelta: 0.0622,
    longitudeDelta: 0.0121,
  });

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  function points() {
    return (
      <>
        <StatusBar
          barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        />
        <ImageBackground
          ref={ref}
          source={require('../../assets/img/tile_vertical.png')}
          style={styles.card}
          borderRadius={borderRadius}
        >
          <View>
            {/* <ProfileImage
              ref={(ref) => (this.profileImage = ref)}
              size={avatarSize}
              onPress={this.onProfileImagePress}
            /> */}
            {context.global.user ? (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.cardTitle}>
                  Hey {context.global.user.firstName}
                </Text>
                <Text style={styles.cardTitle}>Welcome back!</Text>
              </View>
            ) : null}
          </View>

          <View style={{ marginBottom: 20 }}>
            <PointsCell
              value={12}
              coinAndPointsCircleStyle={{
                marginTop: height * 0.02,
                marginBottom: height * 0.02,
              }}
            />
            <Text style={styles.cardFooterTitle}>Points earned</Text>
          </View>
        </ImageBackground>
      </>
    );
  }

  return (
    <SafeAreaView style={{ width: '100%', height: '100%' }}>
      {/* <Text style={{fontSize: 13, marginTop: 20}}>{text}</Text> */}
      {/* <Maps region={mapRegion} /> */}
      {/* <Biomatric /> */}
      {points()}
      <TouchableOpacity
        onPress={() => navigation.navigate('Game')}
        style={{ marginLeft: 20, marginTop: 50 }}
      >
        <Text>Play Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    height: height * 0.6,
    borderRadius: borderRadius,
    paddingHorizontal: '10%',
    paddingTop: '10%',
    paddingBottom: '2%',
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  cardTitle: {
    color: '#fff',
    // fontFamily: 'Montserrat-Medium',
    fontSize: 18,
  },
  cardFooterTitle: {
    fontSize: 12,
    // fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
  }
});
