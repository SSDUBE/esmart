import { Response, Request } from 'express';
import { UserService } from '../controllers/userServices';
import { HTTP_CODES } from '../globals';
import { Admin } from '../models/admin';
import { Principal } from '../models/principal';
import { Logger } from '../utils/logger';

export const signup = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization!;
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64'
    ).toString();
    const [idNumber, password] = decodedCredentials.split(':');
    const user = await Principal.query().findOne({ idNumber });
    const admin = await Admin.query().findOne({ idNumber });

    if (admin) {
      return res
        .status(HTTP_CODES.NOT_ALLOWED)
        .json({
          success: false,
          message:
            'This user cannot be added because he/she is an admin please try login',
        });
    }

    if (user) {
      return res
        .status(HTTP_CODES.NOT_ALLOWED)
        .json({ success: false, message: 'User already exists please signin' });
    } else {
      const { email, schoolName } = req.body;

      await UserService.registerUser({
        idNumber,
        email,
        password,
        schoolName,
        active: true,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Account was succefully created please signin',
      });
    }
  } catch (err) {
    Logger.error('signup: something went wrong ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong creating the user',
    });
  }
};
