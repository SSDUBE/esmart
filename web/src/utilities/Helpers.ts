export class Helpers {
  static getInStorage = async (key: string) => {
    try {
      return await localStorage.getItem(`@esmart:${key}`);
    } catch (e) {
      throw new Error('Failed to get key in local storage');
    }
  };

  static setInStorage = async (key: string, val: string) => {
    try {
      await localStorage.setItem(`@esmart:${key}`, val);
    } catch (e) {
      throw new Error('Failed to set key in local storage');
    }
  };

  static removeInStorage = async (key: string) => {
    try {
      await localStorage.removeItem(`@esmart:${key}`);
    } catch (e) {
      throw new Error('Failed to set key in local storage');
    }
  };
}
