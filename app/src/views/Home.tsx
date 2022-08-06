import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import * as Location from 'expo-location';
import { AppContext } from '../context/context';
import { PointsCell } from '../components/PointsCell';
import { colors } from '../constants/Colors';
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { Loader } from '../components/Loader';
import { RoundedButton } from '../components/RoundedButton';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/RootStackParamList';
import { Camera, getCameraPermissionsAsync } from 'expo-camera';
import { GameService } from '../services/Game';
// import { Maps } from '../components/Maps';
// import { Biomatric } from '../components/Biomatric';
// import { FaceRecognation } from '../components/FaceRecognation';

const { height, width } = Dimensions.get('screen');

interface IHome {
  navigation: NavigationProp<RootStackParamList>;
}

export const Home = ({ navigation }: IHome) => {
  const [point, setPoints] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const context: any = React.useContext(AppContext);
  let [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const game = new GameService();
        let points = await game.getStudentPoints(context.global.user.idNumber);
        let location = await Location.requestForegroundPermissionsAsync();
        const camera = await Camera.requestCameraPermissionsAsync();

        console.log('points ', points)
        if (location.status !== 'granted') {
          setLoading(false);
          setErrorMsg('Permission to access location was denied');
          return;
        }

        if (camera.status !== 'granted') {
          setLoading(false);
          setErrorMsg('Permission to access camera was denied');
          return;
        }

        const res = await Location.getCurrentPositionAsync();
        context.user.updateLocation(res);
        setLocation(res);
        setLoading(false);
        setPoints(points.score)
      } catch (err) {
        console.log('Home something went wrong', err);
        Alert.alert('Something went wrong please try again');
      }
    })();
  }, []);

  function points() {
    return (
      <View style={styles.pointsContainer}>
        <StatusBar
          barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        />
        <View style={styles.card}>
          <View>
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
              value={point}
              coinAndPointsCircleStyle={{
                marginTop: height * 0.02,
                marginBottom: height * 0.02,
              }}
            />
            <Text style={styles.cardFooterTitle}>Points earned</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!fontsLoaded) {
    return <Loader modalVisible={fontsLoaded} animationType='fade' />;
  }

  async function playGame() {
    const permission = await Location.getForegroundPermissionsAsync();
    const camera = await getCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Oops!!!',
        'Location permissions required please go to setting and enable location permission'
      );
      return;
    }

    if (!camera.granted) {
      Alert.alert(
        'Oops!!!',
        'Camera permissions required please go to setting and enable camera permission'
      );
      return;
    }

    navigation.navigate('Game');
  }

  return (
    <SafeAreaView>
      {points()}
      <View style={styles.button}>
        <RoundedButton
          loading={loading}
          disabled={loading}
          text='Play Game'
          background={colors.green01}
          textColor={colors.white}
          handleOnPress={playGame}
        />
      </View>
      <Loader modalVisible={loading} animationType='fade' />
    </SafeAreaView>
  );
};

Home.navigationOptions = ({ navigation }: any) => ({
  title: 'Home',
  headerLeft: () => (
    <AppContext.Consumer>
      {(context) => {
        return (
          <TouchableOpacity
            style={{
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              navigation.dismiss();
            }}
          >
            <Icon name='chevron-down' size={26} color='#000' type='entypo' />
          </TouchableOpacity>
        );
      }}
    </AppContext.Consumer>
  ),
});

const styles = StyleSheet.create({
  pointsContainer: {
    display: 'flex',
    width: '92%',
    alignSelf: 'center',
    marginTop: 50,
  },
  button: {
    display: 'flex',
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
  },
  card: {
    height: height * 0.6,
    borderRadius: 6,
    paddingHorizontal: '10%',
    paddingTop: '10%',
    marginBottom: 25,
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: colors.black,
    backgroundColor: colors.green01,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  cardTitle: {
    color: colors.white,
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
  },
  cardFooterTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
  },
});
