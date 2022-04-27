import { query, Request, Response } from 'express';
import { HTTP_CODES } from '../globals';
import { RoleModel } from '../models/role';
// import { SchoolModel } from '../models/school';
import { UserModel } from '../models/user';
import { Logger } from '../utils/logger';
import { decodeUserToken } from '../utils/util';
import jwt from 'jsonwebtoken';
import { PasswordBcrypt } from './passwordBcrypt';
import { Principal } from '../models/principal';
import { Class } from '../models/class';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { School } from '../models/school';

export const getUser = async (req: Request, res: Response) => {
  try {
    const decodedUser = decodeUserToken(req);

    if (!decodedUser) {
      return res.status(HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'User not authorized please login',
      });
    }

    const { idNumber } = decodedUser;
    const user = await Principal.query().findOne({ idNumber });

    return res.json({
      success: true,
      data: user,
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
    const { idNumber } = req.params;
    const { schoolId } = req.body;

    if (!idNumber || !schoolId) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'idNumber and schoolId missing in params',
      });
    }

    const users = await Promise.all([
      Teacher.query().whereNot('idNumber', '=', idNumber),
      Student.query()
        .select('student.*', 'class.*')
        .from('Student as student')
        .leftJoin('Class as class', 'class.classID', 'student.classID')
        .whereNot('idNumber', '=', idNumber),
    ]);

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: [...users[0], ...users[1]],
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
    const grades = await Class.query();

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
      schoolId,
      // grade,
      gradeId,
    } = req.body;

    // if (roleType === 'STUDENT') {
    //   if (!grade || !gradeId) {
    //     return res.status(HTTP_CODES.FORBIDDEN).json({
    //       success: false,
    //       message: 'grade, and gradeId are required params',
    //     });
    //   }
    // }

    if (
      !firstname ||
      !lastname ||
      !idNumber ||
      !password ||
      !roleType ||
      !schoolId
      // !schoolName
    ) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message:
          'firstname, lastname, idNumber, roleType, gradeType, schoolId, schoolName and password are required params',
      });
    }

    if (roleType === 'STUDENT') {
      if (!gradeId) {
        return res.status(HTTP_CODES.FORBIDDEN).json({
          success: false,
          message: 'gradeId is required params',
        });
      }
    }

    try {
      let createUser: Teacher | Student | undefined = undefined;

      password = await PasswordBcrypt.encrypt(password);

      if (roleType === 'TEACHER') {
        const teacher = await Teacher.query().findOne({ idNumber });

        if (teacher?.schoolID === schoolId) {
          return res.status(HTTP_CODES.NOT_ALLOWED).json({
            success: false,
            message: 'Teacher already exists',
          });
        }

        if (teacher) {
          createUser = await Teacher.query()
            .patch({ schoolID: schoolId })
            .where({ idNumber })
            .returning('*')
            .first();
        } else {
          createUser = await Teacher.query().insertAndFetch({
            idNumber,
            password,
            firstName: firstname,
            lastName: lastname,
            schoolID: schoolId,
          });
        }
      } else if (roleType === 'STUDENT') {
        const student = await Student.query().findOne({ idNumber });

        if (student?.schoolID === schoolId) {
          return res.status(HTTP_CODES.NOT_ALLOWED).json({
            success: false,
            message: 'Student already exists',
          });
        }

        if (student) {
          createUser = await Student.query()
            .patch({ schoolID: schoolId, classID: gradeId })
            .where({ idNumber })
            .returning('*')
            .first();
        } else {
          createUser = await Student.query().insertAndFetch({
            idNumber,
            password,
            firstName: firstname,
            lastName: lastname,
            schoolID: schoolId,
            classID: gradeId,
          });
        }
      }

      return res.status(HTTP_CODES.OK).json({
        success: true,
        data: createUser,
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      email,
      idNumber,
      password,
      roleType,
      roleId,
      grade,
      gradeId,
    } = req.body;

    if (!firstName || !lastName || !contactNumber || !email || !idNumber) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message:
          'firstName, lastName, contactNumber, email and idNumber missing in params',
      });
    }

    const user = await UserModel.findOne({ idNumber });

    if (!user) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'User not found',
      });
    }

    user.roleType = roleType ? roleType : user.roleType;
    user.roleId = roleId ? roleId : user.roleId;
    user.grade = roleType ? grade : user.grade;
    user.roleType = gradeId ? roleType : user.gradeId;
    //
    user!.firstName = firstName;
    user!.lastName = lastName;
    user!.contactNumber = contactNumber;
    user!.email = email;
    user!.idNumber = idNumber;
    user!.password = password
      ? await PasswordBcrypt.encrypt(password)
      : user!.password;

    const updateUser = await UserModel.updateOne(
      { idNumber },
      { $set: { ...user } }
    );

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: updateUser,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
