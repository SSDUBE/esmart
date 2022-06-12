// @ts-ignore
import anagrams from 'english-anagrams';
import { initializeApp } from 'firebase/app';
import { Logger } from '../utils/logger';
import cron from 'node-cron';
import { Game } from '../models/game';
import { Class } from '../models/class';
import { Anagrams } from '../models/anagrams';
import { Request, Response } from 'express';
import { Leaderboard } from '../models/Leaderboard';
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

export const startGame = async () => {
  try {
    const _id = Math.random()
    await setDoc(doc(db, 'chats', '1111'), {
      _id: 111,
      createdAt: new Date(),
      text: {gameWord: 'backend', word: 'there'},
      user: 1,
    });
    // cron.schedule('*/20 * * * * *', () => {
    //   console.log('running a task every minute');
    //   createGame();
    // });
  } catch (err) {
    Logger.log('error ' + err);
  }
};

const createGame = async () => {
  try {
    const word = 'latters';
    const foundAnagrams = anagrams(word);
    const classes = await Class.query();

    await Game.query().update({ complete: true });

    for (let i = 0; i < classes.length; i++) {
      const game = await Game.query().insertGraphAndFetch({
        word,
        classID: classes[i].classID,
      });
      for (let i = 0; i < foundAnagrams.length; i++) {
        await Anagrams.query().insertGraph({
          anagram: foundAnagrams[i],
          gameID: game.gameID,
        });
      }
    }

    console.log('anagrams ', foundAnagrams);
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

    console.log('schoolId ', schoolId)
    if (schoolId) {
      board = await Leaderboard.query()
        .select('leaderboard.*', 'student.*')
        .from('Leaderboard as leaderboard')
        .leftJoin(
          'Student as student',
          'student.idNumber',
          'leaderboard.studentIdNumber'
        )
        .where('student.schoolID', '=', schoolId);
    } else {
      board = await Leaderboard.query()
        .select('leaderboard.*', 'student.*')
        .from('Leaderboard as leaderboard')
        .leftJoin(
          'Student as student',
          'student.idNumber',
          'leaderboard.studentIdNumber'
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
