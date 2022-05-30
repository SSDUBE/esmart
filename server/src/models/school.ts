import { BaseModel } from './base';
import { Class } from './class';
import { Principal } from './principal';
import { SchoolClassRoom } from './schoolClassRoom';
import { Student } from './student';
import { Teacher } from './teacher';

export class School extends BaseModel {
  public readonly schoolID!: string;
  public schoolName!: string;
  public active!: boolean;
  public principal!: Partial<Principal>;
  public teacher!: Partial<Teacher>;
  public school!: Partial<School>;
  public class!: Partial<Class>;

  static tableName: string = 'School';
  static idColumn: string = 'schoolID';

  static relationMappings = {
    principal: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Principal,
      join: {
        from: 'School.schoolID',
        to: 'Principal.schoolID',
      },
    },
    teacher: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Teacher,
      join: {
        from: 'School.schoolID',
        to: 'Teacher.schoolID',
      },
    },
    student: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Student,
      join: {
        from: 'School.schoolID',
        to: 'Student.schoolID',
      },
    },
    schoolClassRoom: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: SchoolClassRoom,
      join: {
        from: 'School.schoolID',
        through: {
          modelClass: Class,
          from: 'SchoolClass.classID',
          to: 'Class.classID',
        },
        to: 'SchoolClass.schoolID',
      },
    },
  };
}
