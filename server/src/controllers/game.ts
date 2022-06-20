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
import { Scrumble } from '../models/scrumble';
import { Student } from '../models/student';
import { Teacher } from '../models/teacher';
import { School } from '../models/school';

export const startGame = async () => {
  try {
    // cron.schedule('*/40 * * * * *', () => {
    //   Logger.log('Now running cron job')
    //   createGame();
    // });
    // createGame();
  } catch (err) {
    Logger.log('error ' + err);
  }
};

const createGame = async () => {
  try {
    const words = await Scrumble.query();
    const classes = await Class.query();

    await Game.query().update({ complete: true });

    for (let i = 0; i < classes.length; i++) {
      const randomNum = Math.floor(Math.random() * words.length);
      const foundAnagrams = await anagramSolver(words[randomNum].word);
      const game = await Game.query().insertGraphAndFetch({
        scrumbleID: words[randomNum].scrumbleID,
        classID: classes[i].classID,
      });

      for (let i = 0; i < foundAnagrams.length; i++) {
        await Anagrams.query().insertGraph({
          anagram: foundAnagrams[i],
          gameID: game.gameID,
        });
      }

      console.log('starting another game');
      await setDoc(doc(db, classes[i].channel, '1111'), {
        _id: 111,
        createdAt: new Date(),
        text: { scrumble: words[randomNum].word, gameID: game.gameID },
        user: 1,
      });
    }
  } catch (err) {
    Logger.log('Something went wrong' + err);
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.body;
    let board: any = [];

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

export const allocatePoints = async (req: Request, res: Response) => {
  try {
    const { gameID, idNumber, answer } = req.body;

    if (!gameID || !idNumber || !answer) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'gameID, idNumber or answer are missing in body',
      });
    }

    const gameRes = await Anagrams.query()
      .select('game.*', 'anagrams.*')
      .from('Anagrams as anagrams')
      .leftJoin('Game as game', 'anagrams.gameID', 'game.gameID')
      .where('game.complete', '=', false)
      .andWhere('game.gameID', '=', gameID)
      .andWhere('anagrams.anagram', '=', answer.toLowerCase())
      .andWhere('anagrams.selected', '=', false);

    if (gameRes.length > 0) {
      const [leaderboard, _] = await Promise.all([
        Leaderboard.query().where({ idNumber }),
        Anagrams.query()
          .patch({ selected: true })
          .where('anagramID', '=', gameRes[0].anagramID),
      ]);

      if (leaderboard.length > 0) {
        await Leaderboard.query()
          .patch({ score: leaderboard[0].score + answer.length })
          .where({ idNumber });
      } else {
        await Leaderboard.query().insert({ score: answer.length, idNumber });
      }
    }

    return res.status(HTTP_CODES.OK).json({
      success: true,
      correct: gameRes.length > 0,
    });
  } catch (err) {
    Logger.error('Failed to allocate points to user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const dbData: any = await Promise.all([
      Student.query().count(),
      Teacher.query().count(),
      Game.query().count(),
      School.query().count(),
      Student.query().count().where('suspended', '=', true),
    ]);

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: {
        totalStudents: dbData[0][0].count,
        totalTeachers: dbData[1][0].count,
        totalGames: dbData[2][0].count,
        totalSchools: dbData[3][0].count,
        totalSuspended: dbData[4][0].count,
      },
    });
  } catch (err) {
    Logger.error('Failed to allocate points to user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const getGameScrumbles = async (req: Request, res: Response) => {
  try {
    const scrumble = await Scrumble.query();

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: scrumble,
    });
  } catch (err) {
    Logger.error('Failed to allocate points to user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const createScrumble = async (req: Request, res: Response) => {
  try {
    const { newWord } = req.body;

    if (!newWord) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'word missing in body',
      });
    }

    const findWord = await Scrumble.query().findOne({
      word: newWord.toLowerCase(),
    });

    if (findWord) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'Word already exists',
      });
    }

    const scrumble = await Scrumble.query().insertAndFetch({
      word: newWord.toLowerCase(),
      wordLength: newWord.length,
    });

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: scrumble,
    });
  } catch (err) {
    Logger.error('Failed to allocate points to user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};

export const deleteScrumble = async (req: Request, res: Response) => {
  try {
    const { scrumbleId } = req.body;

    if (!scrumbleId) {
      return res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        message: 'scrumbleId missing in body',
      });
    }

    const findWord = await Scrumble.query().findById(scrumbleId);

    if (!findWord) {
      return res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        message: 'Scrumble not found',
      });
    }

    const scrumble = await Scrumble.query().deleteById(scrumbleId);

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: scrumble,
    });
  } catch (err) {
    Logger.error('Failed to allocate points to user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
