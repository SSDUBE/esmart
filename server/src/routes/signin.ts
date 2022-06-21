import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';
import { Logger } from '../utils/logger';
import { AUTH, HTTP_CODES } from '../globals';
import { Principal } from '../models/principal';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { Admin } from '../models/admin';
import { Class } from '../models/class';

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
      Principal.query()
        .select('principal.*', 'school.*')
        .from('PRINCIPAL as principal')
        .leftJoin('SCHOOL as school', 'school.schoolID', 'principal.schoolID')
        .where({ idNumber })
        .first(),
      Student.query()
        .select('student.*', 'school.*')
        .from('STUDENT as student')
        .leftJoin('SCHOOL as school', 'school.schoolID', 'student.schoolID')
        .where({ idNumber })
        .first(),
      Teacher.query()
        .select('teacher.*', 'school.*')
        .from('TEACHER as teacher')
        .leftJoin('SCHOOL as school', 'school.schoolID', 'teacher.schoolID')
        .where({ idNumber })
        .first(),
      Admin.query().findOne({ idNumber }),
    ]);
    let index = 0;
    let isPasswordCorrect = true;

    for (let i = 0; i < users.length; i++) {
      if (users[i]) {
        const verify = await PasswordBcrypt.verify(
          password,
          users[i]!.password
        );
        if (!verify) {
          // users[i] = undefined;
          isPasswordCorrect = false;
        }
        index = i;
        break;
      }
    }

    if (!users[index]) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'Username is incorrect',
      });
    }

    if (!isPasswordCorrect) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'Password is incorrect',
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

      if (users[index]?.roleType === 'STUDENT' && users[1]?.classID) {
        const classDetails = await Class.query().where(
          'classID',
          '=',
          users[1]?.classID
        );
        // @ts-ignore
        users[index].channelName = classDetails[0].channel;
      }

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
