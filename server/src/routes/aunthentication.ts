import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH, HTTP_CODES } from '../globals';

const secret = AUTH.SECRET;

export const authentication = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    return jwt.verify(token, secret, (err: any, user: any) => {
      if (err) {
        return res
          .status(HTTP_CODES.UNAUTHORIZED)
          .send({ message: 'Token has an invalid subject' });
      }
      req.user = user;
      return next();
    });
  } else {
    return res
      .status(HTTP_CODES.UNAUTHORIZED)
      .send({ message: 'Token has an invalid subject' });
  }
};
