import { Anagrams } from './anagrams';
import { BaseModel } from './base';

export class Game extends BaseModel {
  public readonly gameID!: number;
  public gameWordID!: number;
  public complete!: boolean;
  public classID!: string;
  public anagrams!: Partial<Anagrams>;

  static tableName: string = 'Game';
  static idColumn: string = 'gameID';

  static relationMappings = {
    anagrams: {
      relation: BaseModel.HasOneRelation,
      modelClass: Anagrams,
      join: {
        from: 'Game.gameID',
        to: 'Anagrams.gameID',
      },
    },
  };
}
