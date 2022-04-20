import {
  getRoles,
  getUser,
  addUser,
  getAllUsers,
  getAllGrades,
} from '../controllers/user';
import { authentication } from './aunthentication';
import { signin } from './signin';
import { signup } from './signup';

const route = '/esmart';

export = function (app: any) {
  app.post(`${route}/sign-up`, signup);
  app.post(`${route}/sign-in`, signin);
  app.get(`${route}/user`, authentication, getUser);
  app.get(`${route}/roles`, authentication, getRoles);
  app.post(`${route}/add-user`, authentication, addUser);
  app.get(`${route}/users/:schoolId`, authentication, getAllUsers);
  app.get(`${route}/grades`, authentication, getAllGrades);
};
