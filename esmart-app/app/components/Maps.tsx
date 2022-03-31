import React, { FunctionComponent } from 'react';
import MapView, { Region, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

interface IMaps {
  region?: Region;
}

export const Maps: FunctionComponent<IMaps> = ({ region }) => {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} loadingEnabled={true}>
        <Marker
          coordinate={{ latitude: -25.561297, longitude: 28.109171 }}
          title={'title'}
          description={'description'}
        />
        <Marker
          coordinate={{ latitude: -25.541295, longitude: 28.109170 }}
          title={'title'}
          description={'description'}
        />
        <Marker
          coordinate={{ latitude: -25.531295, longitude: 28.100000 }}
          title={'title'}
          description={'description'}
        />
        <Polyline
          coordinates={[
            {
              latitude: -25.561297,
              longitude: 28.109171,
            },
            {
              latitude: -25.541295,
              longitude: 28.109170,
            },
          ]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={['#7F0000']}
          strokeWidth={6}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
