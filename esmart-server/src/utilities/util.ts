import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { AUTH } from '../globals';

const secret = AUTH.SECRET;

interface IUser {
  id: string
  id_number: string
}

export function decodeUserToken(req: Request) {
  const authHeader: string = req.headers.authorization!;
  let user: IUser | null = null

  if (authHeader) {
    const [, token] = authHeader.split(' ');
    const decoded = jwt.decode(token);
    try {
      if (decoded) {
        user = {
          // @ts-ignore
          id: decoded.id,
          // @ts-ignore
          id_number: decoded.id_number,
        };
      }
      jwt.verify(token, secret);
    } catch (err) {
      throw new Error('Token has an invalid subject')
    }
    return user;
  }
}
