import { Logger } from "../utils/logger";
import { Request, Response } from 'express';
import { HTTP_CODES } from "../globals";
import { School } from "../models/school";

export const GetallSchools = async (_req: Request, res: Response) => {
  try {
    const schools = await School.query()

    return res.status(HTTP_CODES.OK).json({
      success: true,
      data: schools,
    });
  } catch (err) {
    Logger.error('Failed to get all user ' + err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};