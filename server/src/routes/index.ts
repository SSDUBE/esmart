// import { playGame } from '../controllers/game';
import { getLeaderboard } from '../controllers/game';
import { GetallSchools } from '../controllers/school';
import {
  // getRoles,
  getUser,
  // addUser,
  getAllUsers,
  getAllGrades,
  addNewUser,
  deleteUser,
  updateUser,
  activateOrDeactivateSchool,
} from '../controllers/user';
import { authentication } from './aunthentication';
import { signin } from './signin';
import { signup } from './signup';

const route = '/esmart';

export = function (app: any) {
  app.post(`${route}/sign-up`, signup);
  app.post(`${route}/sign-in`, signin);

  app.put(`${route}/update-user`, authentication, updateUser);

  app.get(`${route}/user`, authentication, getUser);
  app.get(`${route}/all-users`, authentication, getUser);
  app.get(`${route}/grades`, authentication, getAllGrades);
  // app.get(`${route}/roles`, authentication, getRoles);
  app.get(`${route}/schools`, authentication, GetallSchools);
  // app.post(`${route}/add-user`, authentication, addUser);
  app.post(`${route}/add-new-user`, authentication, addNewUser);
  app.post(`${route}/users/:idNumber`, authentication, getAllUsers);
  app.delete(`${route}/user/:idNumber`, authentication, deleteUser);
  app.post(`${route}/leaderboard`, authentication, getLeaderboard);
  app.put(
    `${route}/school/activate-or-deactivate`,
    authentication,
    activateOrDeactivateSchool
  );
  // app.post(`${route}/play-game/`, authentication, playGame);
};
