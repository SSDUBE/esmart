import { Request, Response } from 'express';
import { HTTP_CODES } from '../globals';
import { RoleModel } from '../models/role';
import { SchoolModel } from '../models/school';
import { UserModel } from '../models/user';
import { Logger } from '../utilities/logger';
import { decodeUserToken } from '../utilities/util';

export const getUser = async (req: Request, res: Response) => {
  try {
    const decodedUser = decodeUserToken(req);

    if (!decodedUser) {
      return res.status(HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'User not authorized please login',
      });
    }

    const { id } = decodedUser;

    const user = await UserModel.findById(id);
    const role = await RoleModel.findById(user?.role_id);
    const school = await SchoolModel.findById(user?.school_id);

    return res.json({
      success: true,
      data: {
        user,
        school,
        role: role?.type,
      },
    });
  } catch (err: any) {
    Logger.error('Failed to get user ', err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
