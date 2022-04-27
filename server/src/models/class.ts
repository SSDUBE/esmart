import { BaseModel } from './base';
import { School } from './school';

export class Class extends BaseModel {
  public readonly classID!: string;
  public grade?: string;
  public wordLen?: string;

  static tableName: string = 'Class';
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
