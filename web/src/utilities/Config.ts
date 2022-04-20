import { Domains } from "./Enums"

const env = process.env.REACT_ENV || 'development' // options: 'development', 'test', 'production'.
let domain = Domains[env]

export const Config = {
  services: {
    user: {
      signup: `${domain}/esmart/sign-up`,
      signin: `${domain}/esmart/sign-in`,
      get: `${domain}/esmart/user`,
      all: `${domain}/esmart/users/:userId`,
      roles: `${domain}/esmart/roles`,
      grades: `${domain}/esmart/grades`,
      addNewUser: `${domain}/esmart/add-new-user`,
      delete: `${domain}/esmart/user/:idNumber`
    }
  }
}