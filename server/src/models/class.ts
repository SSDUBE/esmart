import { BaseModel } from './base';
import { School } from './school';

export class Class extends BaseModel {
  public readonly classID!: string;
  public channel!: string;
  public grade!: number;
  // public wordLen?: number;

  static tableName: string = 'CLASS';
  static idColumn: string = 'classID';

  // static relationMappings = {
  //   School: {
  //     relation: BaseModel.HasOneRelation,
  //     modelClass: School,
  //     join: {
  //       from: 'Principal.schoolID',
  //       to: 'School.schoolID',
  //     },
  //   },
  // };
}
