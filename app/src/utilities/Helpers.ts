import AsyncStorage from '@react-native-async-storage/async-storage';

export class Helpers {
  public getInStorage = async (key: string) => {
    try {
      return await AsyncStorage.getItem(`@esmart:${key}`);
    } catch (e) {
      console.log('err ', e)
      throw new Error('Failed to get key in local storage');
    }
  };

  public setInStorage = async (key: string, val: string) => {
    try {
      await AsyncStorage.setItem(`@esmart:${key}`, val);
    } catch (e) {
      console.log('err ', e)
      throw new Error('Failed to set key in local storage ');
    }
  };

  public removeInStorage = async (key: string) => {
    try {
      await AsyncStorage.removeItem(`@esmart:${key}`);
    } catch (e) {
      console.log('err ', e)
      throw new Error('Failed to set key in local storage');
    }
  };
}
