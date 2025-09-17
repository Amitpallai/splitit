import jwt from 'jsonwebtoken';
import { config } from '../config/index';

export const signJWT = (payload: object) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1d' });
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, config.jwtSecret) as { id: string };
};