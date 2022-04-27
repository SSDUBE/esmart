import { BaseModel } from './base';
import { Class } from './class';
import { School } from './school';

export class SchoolClass extends BaseModel {
  public readonly classID!: string;
  public readonly schoolID!: string;

  static tableName: string = 'SchoolClass';
}
