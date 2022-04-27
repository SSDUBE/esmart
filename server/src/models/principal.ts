import { BaseModel } from './base';
import { School } from './school';

export class Principal extends BaseModel {
  public readonly idNumber!: string;
  public firstName?: string;
  public lastName?: string;
  public contactNumber?: string;
  public roleType?: string;
  public email!: string;
  public schoolID!: string;
  public password!: string;
  public active!: string;

  static tableName: string = 'Principal';
  static idColumn: string = 'idNumber';

  static relationMappings = {
    school: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: School,
      join: {
        from: 'Principal.schoolID',
        to: 'School.schoolID',
      },
    },
  };
}
