import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { TOKEN_SECRET } = process.env;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send('A token is required for authentication');
  }
  try {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET as string);
  } catch (err) {
    return res.status(401).send('Access denied, Invalid Token');
  }
  return next();
};
