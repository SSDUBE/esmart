import mongoose from 'mongoose';
import { seedData } from './seedData';
import { Logger } from '../utilities/logger';
import { DB } from '../globals';
import { RoleModel } from '../models/role';
import { GradeModel } from '../models/grade';
import { PasswordBcrypt } from '../controllers/passwordBcrypt';
import { UserModel } from '../models/user';

const logPrefix = 'seeds.seed';

(async () => {
  Logger.log('1 starting roles seed');
  return mongoose
    .connect(DB.DB_STRING, { autoIndex: false })
    .then(
      async () => {
        Logger.log('2 Successfully connected to DB');
        const { roles, grades, admin } = seedData;
        const seedGrades: any[] = [];

        Logger.log('3 creating roles');
        roles.forEach(async (role) => {
          await RoleModel.updateOne(
            { type: role.type },
            { $set: { ...role } },
            { upsert: true }
          );
        });

        grades.forEach((grade) => {
          seedGrades.push(
            GradeModel.updateOne(
              { grade: grade.grade },
              { $set: { ...grade } },
              { upsert: true }
            )
          );
        });

        const dbRoles = await RoleModel.findOne({ type: 'ADMIN' });

        admin.roleType = dbRoles!.type;
        // @ts-ignore
        admin.roleId = dbRoles!._id;
        admin.password = await PasswordBcrypt.encrypt(admin.password);

        const newAdmin = UserModel.updateOne(
          { idNumber: admin.idNumber },
          { $set: { ...admin } },
          { upsert: true }
        );

        await Promise.all([...seedGrades, newAdmin]);
        Logger.log('5 roles creation complete');
      },
      (err) => {
        return Promise.reject(err);
      }
    )
    .catch((err) => {
      Logger.error(`4 ${logPrefix} ${err}`);
    });
})();
