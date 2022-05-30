import { BaseModel } from './base';

export class Anagrams extends BaseModel {
  public readonly anagramID!: number;
  public anagram!: string;
  public gameID!: number;

  static tableName: string = 'Anagrams';
  static idColumn: string = 'anagramID';
}
