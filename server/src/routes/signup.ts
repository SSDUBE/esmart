import { Response, Request } from 'express';
import { UserModel } from '../models/user';
import { UserService } from '../controllers/userServices';
import { HTTP_CODES } from '../globals';
import { SchoolModel } from '../models/school';

export const signup = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization!;
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      'base64'
    ).toString();
    const [idNumber, password] = decodedCredentials.split(':');
    const user = await UserModel.findOne({ idNumber });

    if (user) {
      return res
        .status(HTTP_CODES.NOT_ALLOWED)
        .json({ success: false, message: 'User already exists please signin' });
    } else {
      const { email, roleId, roleType, schoolName } = req.body;

      const school = new SchoolModel({ name: schoolName });
      const newSchool = await school.save();

      await UserService.registerUser({
        idNumber,
        email,
        password,
        roleId,
        schoolId: newSchool._id,
        roleType,
        schoolName,
        active: true,
      });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'Account was succefully created please signin',
      });
    }
  } catch (err) {
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong creating the user',
    });
  }
};
