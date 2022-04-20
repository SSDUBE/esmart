import { RoleModel } from '../models/role';
import { IUser, UserModel } from '../models/user';
import { Logger } from '../utilities/logger';
import { PasswordBcrypt } from './passwordBcrypt';

export class UserService {
  public static async registerUser(newUser: IUser) {
    try {
      if (!newUser.role_id) {
        const role = await RoleModel.findOne({ type: 'PRINCIPAL' });

        if (!role) throw new Error('User role not found');

        newUser.role_id = role._id;
        newUser.role_type = role.type
      }

      newUser.password = await PasswordBcrypt.encrypt(newUser.password);
      const user = new UserModel(newUser);
      const res = await user.save();

      return res;
    } catch (err: any) {
      Logger.error(err.message);
      throw new Error('Oops!!!, Something went wrong');
    }
  }
}
