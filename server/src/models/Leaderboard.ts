import { Anagrams } from './anagrams';
import { BaseModel } from './base';

export class Leaderboard extends BaseModel {
  public readonly leaderboardID!: number;
  public readonly studentIdNumber!: string;
  public score!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static tableName: string = 'Leaderboard';
  static idColumn: string = 'leaderboardID';
}
