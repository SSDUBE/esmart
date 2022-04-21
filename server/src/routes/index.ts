import { GetallSchools } from '../controllers/school';
import {
  getRoles,
  getUser,
  // addUser,
  getAllUsers,
  getAllGrades,
  addNewUser,
  deleteUser,
  updateUser,
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
  app.get(`${route}/roles`, authentication, getRoles);
  app.get(`${route}/schools`, authentication, GetallSchools);
  // app.post(`${route}/add-user`, authentication, addUser);
  app.post(`${route}/add-new-user`, authentication, addNewUser);
  app.post(`${route}/users/:userId`, authentication, getAllUsers);
  app.delete(`${route}/user/:idNumber`, authentication, deleteUser);
};
