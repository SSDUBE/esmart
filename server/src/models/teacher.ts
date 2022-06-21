import { BaseModel } from './base';

export class Teacher extends BaseModel {
  public readonly idNumber!: string;
  public firstName?: string;
  public lastName?: string;
  public contactNumber?: string;
  public roleType?: string;
  public email?: string;
  public schoolID!: string;
  public password!: string;
  public active!: string;

  static tableName: string = 'TEACHER';
  static idColumn: string = 'idNumber';
}
