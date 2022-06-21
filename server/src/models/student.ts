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
  public suspended?: boolean;

  static tableName: string = 'STUDENT';
  static idColumn: string = 'idNumber';
}
