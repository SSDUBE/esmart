import { Domains } from "./Enums"

const env = process.env.REACT_ENV || 'development' // options: 'development', 'test', 'production'.
let domain = Domains[env]

export const Config = {
  services: {
    school: {
      all: `${domain}/esmart/schools`,
    },
    user: {
      signup: `${domain}/esmart/sign-up`,
      signin: `${domain}/esmart/sign-in`,
      get: `${domain}/esmart/user`,
      all: `${domain}/esmart/users/:idNumber`,
      roles: `${domain}/esmart/roles`,
      grades: `${domain}/esmart/grades`,
      addNewUser: `${domain}/esmart/add-new-user`,
      delete: `${domain}/esmart/user/:idNumber`,
      update: `${domain}/esmart/update-user`,
      leaderboard: `${domain}/esmart/leaderboard`,
      activateOrDeactivateSchool: `${domain}/esmart/school/activate-or-deactivate`,
      dashboardData: `${domain}/esmart/dashboard-data`,
      scrumbles: `${domain}/esmart/game-scrumble`,
      createScrumble: `${domain}/esmart/create-scrumble`,
      deleteScrumble: `${domain}/esmart/scrumble`,
    }
  }
}