import { Anagrams } from './anagrams';
import { BaseModel } from './base';

export class Scrumble extends BaseModel {
  public readonly scrumbleID!: number;
  public word!: string;
  public createdAt!: Date;

  static tableName: string = 'Scrumble';
  static idColumn: string = 'scrumbleID';
}
