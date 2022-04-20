import moongose from 'mongoose';
import { Request, Response } from 'express';
import { HTTP_CODES } from '../globals';
import { RoleModel } from '../models/role';
import { SchoolModel } from '../models/school';
import { UserModel } from '../models/user';
import { Logger } from '../utilities/logger';
import { decodeUserToken } from '../utilities/util';
import jwt from 'jsonwebtoken';
import { PasswordBcrypt } from './passwordBcrypt';
import { GradeModel } from '../models/grade';

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

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await RoleModel.find({ type: { $ne: 'ADMIN' } });

    return res.json({
      success: true,
      data: roles,
    });
  } catch (err: any) {
    Logger.error('Failed to get roles ', err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, idNumber, roleId, password } = req.body;

    if (!firstname || !lastname || !idNumber || !roleId || !password) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message:
          'firstname, lastname, idNumber, roleId and password are required params',
      });
    }

    const role = await RoleModel.findById(roleId);
    const authHeader = req.headers.authorization;
    const token = authHeader!.split(' ')[1];
    const decode: any = jwt.decode(token);
    const newPassword = await PasswordBcrypt.encrypt(password);
    let newUser = {};

    if (!role) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'User role not found',
      });
    }

    const addUser = await UserModel.findOne({ id_number: idNumber });
    const user = await UserModel.findOne({ id_number: decode!.id_number });

    if (!addUser) {
      const createNewUser = new UserModel({
        active: true,
        first_name: firstname,
        last_name: lastname,
        id_number: idNumber,
        role_id: roleId,
        school_id: user?.school_id,
        created_by: user?._id,
        updated_by: user?._id,
        password: newPassword,
      });

      await createNewUser.save();

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'User successfully added',
      });
    } else {
      if (addUser.school_id.toHexString() === user?.school_id.toHexString()) {
        return res.status(HTTP_CODES.NOT_ALLOWED).json({
          success: false,
          message: 'User already exists',
        });
      }

      newUser = Object.assign({}, addUser, {
        first_name: firstname,
        last_name: lastname,
        id_number: idNumber,
        role_id: roleId,
        updated_by: user?._id,
        password,
      });

      await UserModel.findByIdAndUpdate(addUser?._id, { $set: { ...newUser } });

      return res.status(HTTP_CODES.OK).json({
        success: true,
        message: 'User successfully added',
      });
    }
  } catch (err: any) {
    Logger.error('Failed to add user ', err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.params;
    const users = await UserModel.find({ school_id: schoolId });

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: users,
    });
  } catch (err) {
    Logger.error('Failed to get all user ');
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const getAllGrades = async (_req: Request, res: Response) => {
  try {
    const grades = await GradeModel.find({});

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: grades,
    });
  } catch (err) {
    Logger.error('Failed to get all user ');
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
