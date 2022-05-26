import axios, { AxiosRequestConfig } from 'axios';
import { Logger } from './logger';

interface AxiosResponseObjectProps {
  word_length: string;
  _meta: {
    total: number;
  };
  _items: WordProps[];
}
interface WordProps {
  word: string;
  scores: number[];
  mod: string;
}
interface GeneratedWordsProps {
  total: number;
  words: WordProps[];
}
export const generateAnagrams = async (seedWord: string, length?: number) => {
  try {
    const wordLength = length ? length : null;
    const axiosConfig: AxiosRequestConfig = {
      method: 'GET',
      url: `${
        process.env.WORD_API_HOST
      }?tiles=${seedWord}&offset=0&limit=10000&order_by=score&group_by=word_length&dictionary=US&bonus=false&dictionary_opt=YDR&check_exact_match=true&exclude_original=false&original_tiles=${seedWord}${
        wordLength ? `&word_length=wordLength${wordLength}` : ''
      }`,
    };
    const { data } = await axios(axiosConfig);
    let generatedWords: GeneratedWordsProps = { total: 0, words: [] };

    if (data.data._groups.length) {
      const dataGroups: AxiosResponseObjectProps[] = data.data._groups;
      for (let i = 0; i < dataGroups.length; i++) {
        const dataGroup = dataGroups[i];
        const newWords = [...generatedWords.words, ...dataGroup._items];
        // Remove words with two letters or less
        generatedWords.words = newWords.filter(
          (newWord) => newWord.word.length > 2
        );
      }
      generatedWords = {
        ...generatedWords,
        total: generatedWords.words.length,
      };
    }
    return generatedWords;
  } catch (error) {
    Logger.error('Error generate scrambles: ' + error);
  }
};
