import { BaseModel } from './base';

export class Student extends BaseModel {
  public readonly idNumber!: string;
  public firstName?: string;
  public lastName?: string;
  public contactNumber?: string;
  public email?: string;
  public roleType?: string;
  public password!: string;
  public active!: string;
  public schoolID!: string;
  public classID!: string;

  static tableName: string = 'Student';
  static idColumn: string = 'idNumber';
}
