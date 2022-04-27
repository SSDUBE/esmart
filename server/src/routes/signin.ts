import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';
import { Logger } from '../utils/logger';
import { AUTH, HTTP_CODES } from '../globals';
import { Principal } from '../models/principal';
import { Teacher } from '../models/teacher';

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
    let users = await Promise.all([
      Principal.query().findOne({ idNumber }),
      await Teacher.query().findOne({ idNumber }),
    ]);
    let index = 0
    // let [principal, teacher] = user;

    for (let i = 0; i < users.length; i++) {
      if (users[i]) {
        const verify = await PasswordBcrypt.verify(
          password,
          users[i]!.password
        );
        if (!verify) {
          users[i] = undefined;
        }
        index = i
        break;
      }
    }

    if (!users[index]) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }
  
    if (users[index]) {
      if (!users[index]?.active) {
        return res.status(HTTP_CODES.FORBIDDEN).json({
          success: false,
          message: 'Account is deactivated please speak to your admin',
        });
      }

      const accessToken = jwt.sign(
        { idNumber: users[index]?.idNumber, email: users[index]?.email },
        secret
      );

      return res.json({
        success: true,
        accessToken,
        data: users[index],
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
