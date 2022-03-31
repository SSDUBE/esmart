import { Request, Response } from 'express';
import { HTTP_CODES } from '../globals';
import { RoleModel } from '../models/role';
import { Logger } from '../utilities/logger';

export const getRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await RoleModel.find({ type: { $ne: 'ADMIN' } });

    return res.json({
      success: true,
      data: roles,
    });
  } catch (err: any) {
    Logger.error('Failed to get user ', err);
    return res.status(HTTP_CODES.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong please try again',
    });
  }
};
