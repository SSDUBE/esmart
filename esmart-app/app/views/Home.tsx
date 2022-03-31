import React from 'react'
import { SafeAreaView, Text } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Maps } from '../components/Maps';
import { Biomatric } from '../components/Biomatric';
import { FaceRecognation } from '../components/FaceRecognation';

export const Home = () => {
  const [location, setLocation] = React.useState<Location.LocationObject | null>(null);
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

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      {/* <Text style={{fontSize: 13, marginTop: 20}}>{text}</Text> */}
      {/* <Maps region={mapRegion} /> */}
      {/* <Biomatric /> */}

      <FaceRecognation />
    </SafeAreaView>
  );
}