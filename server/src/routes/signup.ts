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
    const [id_number, password] = decodedCredentials.split(':');
    const user = await UserModel.findOne({ id_number });

    if (user) {
      return res
        .status(HTTP_CODES.NOT_ALLOWED)
        .json({ success: false, message: 'User already exists please signin' });
    } else {
      const { email, role_id, role_type, schoolName } = req.body;

      const school = new SchoolModel({ name: schoolName });
      const newSchool = await school.save();

      await UserService.registerUser({
        id_number,
        email,
        password,
        role_id,
        school_id: newSchool._id,
        role_type,
        school_name: schoolName,
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
