import { Anagrams } from './anagrams';
import { BaseModel } from './base';

export class Game extends BaseModel {
  public readonly gameID!: number;
  public scrumbleID!: number;
  public complete!: boolean;
  public classID!: string;
  public anagrams!: Partial<Anagrams>;

  static tableName: string = 'GAME';
  static idColumn: string = 'gameID';

  static relationMappings = {
    anagrams: {
      relation: BaseModel.HasOneRelation,
      modelClass: Anagrams,
      join: {
        from: 'GAME.gameID',
        to: 'ANAGRAMS.gameID',
      },
    },
  };
}
