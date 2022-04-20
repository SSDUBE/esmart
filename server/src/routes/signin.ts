import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';
import { RoleModel } from '../models/role';
import { Logger } from '../utilities/logger';
import { AUTH, HTTP_CODES } from '../globals';
import { SchoolModel } from '../models/school';

const secret = AUTH.SECRET;

export const signin = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization!;
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64'
    ).toString();
    const [idNumber, password] = decodedCredentials.split(':');
    let user = await UserModel.findOne({ idNumber });

    if (user) {
      const verify = await PasswordBcrypt.verify(password, user!.password);
      if (!verify) user = null;
    }

    if (user) {
      if (!user.active) {
        return res
          .status(HTTP_CODES.FORBIDDEN)
          .json({
            success: false,
            message: 'Account is deactivated please speak to your admin',
          });
      }

      const accessToken = jwt.sign(
        { idNumber: user.idNumber, id: user._id },
        secret
      );

      const role = await RoleModel.findById(user.roleId);
      const school = await SchoolModel.findById(user.schoolId);

      if (!role) {
        throw new Error('No role found for this user');
      }

      if (!school) {
        throw new Error('No school found for this user');
      }

      return res.json({
        success: true,
        accessToken,
        data: {
          user,
          school,
          role: role?.type,
        },
      });
    } else {
      res
        .status(HTTP_CODES.FORBIDDEN)
        .json({ success: false, message: 'Username or password incorrect' });
    }
  } catch (err: any) {
    Logger.error('Sign in error ', err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
