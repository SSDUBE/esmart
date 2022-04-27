import { Class } from '../models/class';
import { School } from '../models/school';
import { SchoolClass } from '../models/schoolClass';
import { Logger } from '../utils/logger';
import { PasswordBcrypt } from './passwordBcrypt';

export class UserService {
  public static async registerUser(user: any) {
    try {
      user.password = await PasswordBcrypt.encrypt(user.password);
      const classes = await Class.query()
      const createClass: any = [];

      const res = await School.query().insertGraphAndFetch({
        schoolName: user.schoolName,
        principal: {
          idNumber: user.idNumber,
          email: user.email,
          password: user.password,
        },
      });

      classes.forEach((item) => {
        createClass.push(SchoolClass.query().insertGraph({ classID: item.classID, schoolID: res.schoolID }));
      });

      await Promise.all(createClass);

      return null;
    } catch (err: any) {
      Logger.error('registerUser ' + err.message);
      throw new Error('Oops!!!, Something went wrong');
    }
  }
}
