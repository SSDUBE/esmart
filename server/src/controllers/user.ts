import { Request, Response } from 'express';
import { HTTP_CODES } from '../globals';
import { Logger } from '../utils/logger';
import { decodeUserToken } from '../utils/util';
import { PasswordBcrypt } from './passwordBcrypt';
import { Principal } from '../models/principal';
import { Class } from '../models/class';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { School } from '../models/school';
import { Admin } from '../models/admin';
import { Game } from '../models/game';

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

    const [principal, teacher, student, admin] = await Promise.all([
      Principal.query()
        .select('principal.*', 'school.*')
        .from('Principal as principal')
        .leftJoin('School as school', 'school.schoolID', 'principal.schoolID')
        .where('principal.idNumber', '=', idNumber)
        .first(),
      Teacher.query()
        .select('teacher.*', 'school.*')
        .from('Teacher as teacher')
        .leftJoin('School as school', 'school.schoolID', 'teacher.schoolID')
        .where('teacher.idNumber', '=', idNumber)
        .first(),
      Student.query()
        .select('student.*', 'school.*')
        .from('Student as student')
        .leftJoin('School as school', 'school.schoolID', 'student.schoolID')
        .where('student.idNumber', '=', idNumber)
        .first(),
      Admin.query().findOne({ idNumber }),
    ]);

    return res.json({
      success: true,
      data: principal || teacher || student || admin,
    });
  } catch (err: any) {
    Logger.error('Failed to get user ', err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

// export const getRoles = async (_req: Request, res: Response) => {
//   try {
//     const roles = await RoleModel.find({ type: { $ne: 'ADMIN' } });

//     return res.json({
//       success: true,
//       data: roles,
//     });
//   } catch (err: any) {
//     Logger.error('Failed to get roles ', err);
//     return res.status(HTTP_CODES.SERVER_ERROR).json({
//       success: false,
//       message: 'Something went wrong please try again',
//     });
//   }
// };

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
    const { schoolId, roleType } = req.body;
    let user: [Teacher[], Principal[], Student[]] = [[], [], []];

    if (!idNumber) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'idNumber and schoolId missing in params',
      });
    }

    if (roleType === 'ADMIN') {
      user = await Promise.all([
        Teacher.query().whereNot('idNumber', '=', idNumber),
        Principal.query().whereNot('idNumber', '=', idNumber),
        Student.query()
          .select('student.*', 'class.*')
          .from('Student as student')
          .leftJoin('Class as class', 'class.classID', 'student.classID')
          .whereNot('idNumber', '=', idNumber),
      ]);
    } else {
      user = await Promise.all([
        Teacher.query()
          .whereNot('idNumber', '=', idNumber)
          .andWhere('schoolID', '=', schoolId),
        Principal.query()
          .whereNot('idNumber', '=', idNumber)
          .andWhere('schoolID', '=', schoolId),
        Student.query()
          .select('student.*', 'class.*')
          .from('Student as student')
          .leftJoin('Class as class', 'class.classID', 'student.classID')
          .whereNot('idNumber', '=', idNumber)
          .andWhere('schoolID', '=', schoolId),
      ]);
    }

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: [...user[0], ...user[1], ...user[2]],
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
    let {
      firstname,
      idNumber,
      lastname,
      password,
      roleType,
      schoolId,
      email,
      gradeId,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !idNumber ||
      !password ||
      !roleType ||
      !schoolId ||
      !email
      // !schoolName
    ) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message:
          'email, firstname, lastname, idNumber, roleType, gradeType, schoolId, schoolName and password are required params',
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
      let createUser: Teacher | Student | Principal | Admin | undefined =
        undefined;

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
            email: email,
            firstName: firstname,
            lastName: lastname,
            schoolID: schoolId,
          });
        }
      } else if (roleType === 'PRINCIPAL') {
        const principal = await Principal.query().findOne({ idNumber });

        if (principal?.schoolID === schoolId) {
          return res.status(HTTP_CODES.NOT_ALLOWED).json({
            success: false,
            message: 'Principal already exists',
          });
        }

        if (principal) {
          createUser = await Principal.query()
            .patch({ schoolID: schoolId })
            .where({ idNumber })
            .returning('*')
            .first();
        } else {
          createUser = await Principal.query().insertAndFetch({
            idNumber,
            password,
            email: email,
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
            email: email,
            firstName: firstname,
            lastName: lastname,
            schoolID: schoolId,
            classID: gradeId,
          });
        }
      } else if (roleType === 'ADMIN') {
        const student = await Admin.query().findOne({ idNumber });

        if (student) {
          return res.status(HTTP_CODES.NOT_ALLOWED).json({
            success: false,
            message: 'Admin already exists in the system',
          });
        }

        createUser = await Admin.query().insertAndFetch({
          idNumber,
          firstName: firstname,
          lastName: lastname,
          contactNumber: '',
          email,
          password: await PasswordBcrypt.encrypt('Admin@123'),
        });
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

    const [teacher, student, principal] = await Promise.all([
      Teacher.query().findOne({ idNumber }),
      Student.query().findOne({ idNumber }),
      Principal.query().findOne({ idNumber }),
    ]);

    if (!teacher && !student && !principal) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'User not found',
      });
    }

    if (teacher) {
      await Teacher.query().delete().where('idNumber', '=', idNumber);
    } else if (student) {
      await Student.query().delete().where('idNumber', '=', idNumber);
    } else if (principal) {
      await Principal.query().delete().where('idNumber', '=', idNumber);
    }

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
    let {
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
      schoolID,
    } = req.body;

    if (!firstName || !lastName || !contactNumber || !email || !idNumber) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message:
          'firstName, lastName, contactNumber, email and idNumber missing in params',
      });
    }

    const [teacher, student, principal, admin] = await Promise.all([
      Teacher.query().findOne({ idNumber }),
      Student.query().findOne({ idNumber }),
      Principal.query().findOne({ idNumber }),
      Admin.query().findOne({ idNumber }),
    ]);

    let user: any = {};

    if (!teacher && !student && !principal && !admin) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    if (roleType == 'STUDENT') {
      if (teacher) {
        await Teacher.query().delete().where('idNumber', '=', idNumber);
      }

      if (student) {
        password = password
          ? await PasswordBcrypt.encrypt(password)
          : student.password;

        user = await Student.query()
          .patch({
            idNumber,
            password,
            firstName,
            lastName,
            schoolID,
            contactNumber,
            email,
            classID: gradeId,
          })
          .where({ idNumber })
          .returning('*')
          .first();
      } else {
        password = password
          ? await PasswordBcrypt.encrypt(password)
          : teacher?.password;

        user = await Student.query().insertAndFetch({
          idNumber,
          password,
          firstName,
          lastName,
          schoolID,
          contactNumber,
          email,
          classID: gradeId,
        });
      }
    } else if (roleType === 'TEACHER') {
      if (student) {
        await Student.query().delete().where('idNumber', '=', idNumber);
      }

      if (teacher) {
        password = password
          ? await PasswordBcrypt.encrypt(password)
          : teacher.password;

        user = await Teacher.query()
          .patch({
            idNumber,
            password,
            firstName,
            lastName,
            schoolID,
            contactNumber,
            email,
          })
          .where({ idNumber })
          .returning('*')
          .first();
      } else {
        password = password
          ? await PasswordBcrypt.encrypt(password)
          : student?.password;

        user = await Teacher.query().insertAndFetch({
          idNumber,
          password,
          firstName,
          lastName,
          schoolID,
          contactNumber,
          email,
        });
      }
    } else if (roleType === 'PRINCIPAL') {
      password = password
        ? await PasswordBcrypt.encrypt(password)
        : principal?.password;

      user = await Principal.query()
        .patch({
          idNumber,
          password,
          firstName,
          lastName,
          schoolID,
          contactNumber,
          email,
        })
        .where({ idNumber })
        .returning('*')
        .first();
    }

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: user,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const activateOrDeactivateSchool = async (
  req: Request,
  res: Response
) => {
  try {
    const { schoolId, status } = req.body;

    if (!schoolId || status === undefined || status === null) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'schoolId and status are missing in params',
      });
    }

    const update = await School.query()
      .patch({ active: status })
      .where({ schoolID: schoolId })
      .returning('*')
      .first();

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: update,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
