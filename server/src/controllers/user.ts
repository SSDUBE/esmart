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
    const role = await RoleModel.findById(user?.roleId);
    const school = await SchoolModel.findById(user?.schoolId);

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

// export const addUser = async (req: Request, res: Response) => {
//   try {
//     const { firstname, lastname, idNumber, roleId, password } = req.body;

//     if (!firstname || !lastname || !idNumber || !roleId || !password) {
//       return res.status(HTTP_CODES.FORBIDDEN).json({
//         success: false,
//         message:
//           'firstname, lastname, idNumber, roleId and password are required params',
//       });
//     }

//     const role = await RoleModel.findById(roleId);
//     const authHeader = req.headers.authorization;
//     const token = authHeader!.split(' ')[1];
//     const decode: any = jwt.decode(token);
//     const newPassword = await PasswordBcrypt.encrypt(password);
//     let newUser = {};

//     if (!role) {
//       return res.status(HTTP_CODES.NOT_FOUND).json({
//         success: false,
//         message: 'User role not found',
//       });
//     }

//     const addUser = await UserModel.findOne({ idNumber: idNumber });
//     const user = await UserModel.findOne({ idNumber: decode!.idNumber });

//     if (!addUser) {
//       const createNewUser = new UserModel({
//         active: true,
//         firstName: firstname,
//         lastName: lastname,
//         idNumber: idNumber,
//         roleId: roleId,
//         schoolId: user?.schoolId,
//         createdBy: user?._id,
//         updatedBy: user?._id,
//         password: newPassword,
//       });

//       await createNewUser.save();

//       return res.status(HTTP_CODES.OK).json({
//         success: true,
//         message: 'User successfully added',
//       });
//     } else {
//       console.log('addUser ', addUser);
//       console.log('addUser ', addUser);

//       if (addUser?.schoolId?.toHexString() === user?.schoolId?.toHexString()) {
//         return res.status(HTTP_CODES.NOT_ALLOWED).json({
//           success: false,
//           message: 'User already exists',
//         });
//       }

//       newUser = Object.assign({}, addUser, {
//         firstName: firstname,
//         lastName: lastname,
//         idNumber: idNumber,
//         roleId: roleId,
//         updatedBy: user?._id,
//         password,
//       });

//       await UserModel.findByIdAndUpdate(addUser?._id, { $set: { ...newUser } });

//       return res.status(HTTP_CODES.OK).json({
//         success: true,
//         message: 'User successfully added',
//       });
//     }
//   } catch (err: any) {
//     Logger.error('Failed to add user ', err);
//     return res.status(HTTP_CODES.SERVER_ERROR).json({
//       success: false,
//       message: 'Something went wrong please try again',
//     });
//   }
// };

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { schoolId } = req.body;
    let users = [];

    if (!userId) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'userId missing in params',
      });
    }

    if (!schoolId) {
      users = await UserModel.find({
        _id: { $ne: userId },
        schoolId: { $ne: null },
      });
    } else {
      users = await UserModel.find({
        schoolId: schoolId,
        _id: { $ne: userId },
      });
    }

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: users,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
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
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const addNewUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader!.split(' ')[1];
    const decode: any = jwt.decode(token);
    let {
      firstname,
      idNumber,
      lastname,
      password,
      roleType,
      roleId,
      schoolId,
      schoolName,
      grade,
      gradeId,
    } = req.body;

    if (roleType === 'STUDENT') {
      if (!grade || !gradeId) {
        return res.status(HTTP_CODES.FORBIDDEN).json({
          success: false,
          message: 'grade, and gradeId are required params',
        });
      }
    }

    if (
      !firstname ||
      !lastname ||
      !idNumber ||
      !roleId ||
      !password ||
      !roleType ||
      !schoolId ||
      !schoolName
    ) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message:
          'firstname, lastname, idNumber, roleId, roleType, gradeType, schoolId, schoolName and password are required params',
      });
    }

    try {
      password = await PasswordBcrypt.encrypt(password);
      const findUser = await UserModel.findOne({ idNumber: idNumber });
      const currUser = await UserModel.findOne({ idNumber: decode!.idNumber });

      if (findUser) {
        if (
          findUser?.schoolId?.toHexString() ===
          currUser?.schoolId?.toHexString()
        ) {
          return res.status(HTTP_CODES.NOT_ALLOWED).json({
            success: false,
            message: 'User already exists',
          });
        }

        const newUser = Object.assign(findUser, {
          firstName: firstname,
          lastName: lastname,
          idNumber,
          schoolName,
          schoolId,
          roleType,
          roleId,
          grade,
          gradeId,
          updatedBy: currUser?._id,
          password,
        });

        await UserModel.findByIdAndUpdate(findUser?._id, {
          $set: { ...newUser },
        });

        return res.status(HTTP_CODES.OK).json({
          success: true,
          data: newUser,
        });
      }

      const newUser = new UserModel({
        firstName: firstname,
        lastName: lastname,
        idNumber,
        roleType,
        roleId,
        schoolId,
        schoolName,
        password,
        grade,
        gradeId,
      });

      const user = await newUser.save();

      return res.status(HTTP_CODES.OK).json({
        success: true,
        data: user,
      });
    } catch (err) {
      Logger.error('Failed to add user ' + err);
      return res.status(HTTP_CODES.SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong please try again',
      });
    }
  } catch (err) {
    Logger.error('Failed to get all user ');
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { idNumber } = req.params;

    if (!idNumber) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'idNumber missing in params',
      });
    }

    const user = await UserModel.findOne({ idNumber });

    if (!user) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'User not found',
      });
    }

    user!.schoolName = null;
    user!.schoolId = null;

    await UserModel.updateOne({ idNumber }, { $set: { ...user } });

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: null,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
