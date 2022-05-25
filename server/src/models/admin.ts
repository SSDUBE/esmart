import { BaseModel } from './base';
import { School } from './school';

export class Admin extends BaseModel {
  public readonly idNumber!: string;
  public firstName?: string;
  public lastName?: string;
  public contactNumber?: string;
  public roleType?: string;
  public email!: string;
  public schoolID?: string;
  public password!: string;
  public active!: string;

  static tableName: string = 'Admin';
  static idColumn: string = 'idNumber';

  // static relationMappings = {
  //   school: {
  //     relation: BaseModel.BelongsToOneRelation,
  //     modelClass: School,
  //     join: {
  //       from: 'Admin.schoolID',
  //       to: 'School.schoolID',
  //     },
  //   },
  // };
}
