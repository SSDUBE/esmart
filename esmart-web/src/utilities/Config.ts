import { Domains } from "./Enums"

const env = process.env.REACT_ENV || 'development' // options: 'development', 'test', 'production'.
let domain = Domains[env]

export const Config = {
  services: {
    user: {
      signup: `${domain}/esmart/sign-up`,
      signin: `${domain}/esmart/sign-in`,
      get: `${domain}/esmart/user`
    }
  }
}