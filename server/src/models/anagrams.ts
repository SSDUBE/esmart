import { BaseModel } from './base';

export class Anagrams extends BaseModel {
  public readonly anagramID!: number;
  public anagram!: string;
  public selected!: boolean;
  public gameID!: number;

  static tableName: string = 'ANAGRAMS';
  static idColumn: string = 'anagramID';
}
