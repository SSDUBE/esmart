import { Dimensions } from 'react-native';

export const iPhoneSize = () => {
  const windowWidth = Dimensions.get('window').width;
  if (windowWidth === 320) {
    return 'small'; // iPhone SE
  }
  if (windowWidth === 414) {
    return 'large'; // iPhone Plus
  }
  return 'medium'; // iPhone 6/7
};
