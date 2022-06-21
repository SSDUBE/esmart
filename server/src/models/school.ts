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

  static tableName: string = 'SCHOOL';
  static idColumn: string = 'schoolID';

  static relationMappings = {
    principal: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Principal,
      join: {
        from: 'SCHOOL.schoolID',
        to: 'PRINCIPAL.schoolID',
      },
    },
    teacher: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Teacher,
      join: {
        from: 'SCHOOL.schoolID',
        to: 'TEACHER.schoolID',
      },
    },
    student: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Student,
      join: {
        from: 'SCHOOL.schoolID',
        to: 'STUDENT.schoolID',
      },
    },
    schoolClassRoom: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: SchoolClassRoom,
      join: {
        from: 'SCHOOL.schoolID',
        through: {
          modelClass: Class,
          from: 'SCHOOLCLASSROOM.classID',
          to: 'CLASS.classID',
        },
        to: 'SCHOOLCLASSROOM.schoolID',
      },
    },
  };
}
