import {
  getRoles,
  getUser,
  addUser,
  getAllUsers,
  getAllGrades,
  addNewUser,
} from '../controllers/user';
import { authentication } from './aunthentication';
import { signin } from './signin';
import { signup } from './signup';

const route = '/esmart';

export = function (app: any) {
  app.post(`${route}/sign-up`, signup);
  app.post(`${route}/add-new-user`, addNewUser);
  app.post(`${route}/sign-in`, signin);
  app.get(`${route}/user`, authentication, getUser);
  app.get(`${route}/all-users`, authentication, getUser);
  app.get(`${route}/grades`, authentication, getAllGrades);
  app.get(`${route}/roles`, authentication, getRoles);
  app.post(`${route}/add-user`, authentication, addUser);
  app.post(`${route}/users/:userId`, authentication, getAllUsers);
};
