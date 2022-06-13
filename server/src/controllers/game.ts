// @ts-ignore
import anagramSolver from 'anagram-solver';
import { initializeApp } from 'firebase/app';
import { Logger } from '../utils/logger';
import cron from 'node-cron';
import { Game } from '../models/game';
import { Class } from '../models/class';
import { Anagrams } from '../models/anagrams';
import { Request, Response } from 'express';
import { Leaderboard } from '../models/leaderboard';
import { HTTP_CODES } from '../globals';
import { db } from '../utils/firebase';
import {
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  collection,
} from 'firebase/firestore';
import { GameWords } from '../models/gameWords';

export const startGame = async () => {
  try {
    // cron.schedule('*/20 * * * * *', () => {
    //   console.log('running a task every minute');
    //   createGame();
    // });
    createGame();
  } catch (err) {
    Logger.log('error ' + err);
  }
};

const createGame = async () => {
  try {
    const words = await GameWords.query();
    const classes = await Class.query();

    console.log('classes ', classes)
    await Game.query().update({ complete: true });

    for (let i = 0; i < classes.length; i++) {
      const randomNum = Math.floor(Math.random() * words.length);
      const foundAnagrams = await anagramSolver(words[randomNum].word);
      const game = await Game.query().insertGraphAndFetch({
        gameWordID: words[randomNum].gameWordID,
        classID: classes[i].classID,
      });
      for (let i = 0; i < foundAnagrams.length; i++) {
        await Anagrams.query().insertGraph({
          anagram: foundAnagrams[i],
          gameID: game.gameID,
        });
      }

      // await setDoc(doc(db, 'chats', '1111'), {
      //   _id: 111,
      //   createdAt: new Date(),
      //   text: {gameWord: 'backend', word: 'there'},
      //   user: 1,
      // });
    }

    // console.log('anagrams ', foundAnagrams);
  } catch (err) {
    Logger.log('Something went wrong' + err);
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.body;
    let board: any = [];
    // const user = await Promise.all([
    //   // Teacher.query().whereNot('idNumber', '=', idNumber),
    //   // Principal.query().whereNot('idNumber', '=', idNumber),
    // ]);

    console.log('schoolId ', schoolId);
    if (schoolId) {
      board = await Leaderboard.query()
        .select('leaderboard.*', 'student.*')
        .from('Leaderboard as leaderboard')
        .leftJoin(
          'Student as student',
          'student.idNumber',
          'leaderboard.idNumber'
        )
        .where('student.schoolID', '=', schoolId);
    } else {
      board = await Leaderboard.query()
        .select('leaderboard.*', 'student.*')
        .from('Leaderboard as leaderboard')
        .leftJoin(
          'Student as student',
          'student.idNumber',
          'leaderboard.idNumber'
        );
    }

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: board,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
