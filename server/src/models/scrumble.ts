import { Anagrams } from './anagrams';
import { BaseModel } from './base';

export class Scrumble extends BaseModel {
  public readonly scrumbleID!: number;
  public word!: string;
  public createdAt!: Date;
  public wordLength!: number;

  static tableName: string = 'Scrumble';
  static idColumn: string = 'scrumbleID';
}
