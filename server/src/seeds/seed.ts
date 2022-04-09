import mongoose from 'mongoose';
import seedData from './seedData.json';
import { Logger } from '../utilities/logger';
import { DB } from '../globals';
import { RoleModel } from '../models/role';

const logPrefix = 'seeds.seed';

(async () => {
  Logger.log('1 starting roles seed');
  return mongoose
    .connect(DB.DB_STRING, { autoIndex: false })
    .then(
      async () => {
        Logger.log('2 Successfully connected to DB');
        const { roles } = seedData;
        const seedRoles: any[] = [];

        Logger.log('3 creating roles');
        roles.forEach((role) => {
          seedRoles.push(
            RoleModel.updateOne(
              { type: role.type },
              { $set: { ...role } },
              { upsert: true }
            )
          );
        });

        await Promise.all(seedRoles);
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
