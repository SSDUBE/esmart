import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';
import { Logger } from '../utils/logger';
import { AUTH, HTTP_CODES } from '../globals';
import { Principal } from '../models/principal';

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
    let user = await Principal.query().findOne({ idNumber });

    if (user) {
      const verify = await PasswordBcrypt.verify(password, user!.password);
      if (!verify) {
        user = undefined;
      }
    }

    if (user) {
      if (!user.active) {
        return res.status(HTTP_CODES.FORBIDDEN).json({
          success: false,
          message: 'Account is deactivated please speak to your admin',
        });
      }

      const accessToken = jwt.sign(
        { idNumber: user.idNumber, email: user.email },
        secret
      );

      return res.json({
        success: true,
        accessToken,
        data: user,
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
