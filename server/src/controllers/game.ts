// @ts-ignore
import anagrams from 'english-anagrams';
import { Logger } from '../utils/logger';

export const startGame = async () => {
  try {
    const seedWord = 'latters';
    const foundAnagrams = anagrams(seedWord);

    console.log('anagrams ', foundAnagrams);
  } catch (err) {
    Logger.log('error ' + err);
  }
};
