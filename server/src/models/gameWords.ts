import { Anagrams } from './anagrams';
import { BaseModel } from './base';

export class GameWords extends BaseModel {
  public readonly gameWordID!: number;
  public word!: string;
  public createdAt!: Date;

  static tableName: string = 'GameWords';
  static idColumn: string = 'gameWordID';
}
