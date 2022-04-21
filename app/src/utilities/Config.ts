import { Domains } from './Enums';

const env = process.env.REACT_ENV || 'development'; // options: 'development', 'test', 'production'.
let domain = Domains[env];

export const Config = {
  services: {
    user: {
      signin: `${domain}/esmart/sign-in`,
    },
  },
};
