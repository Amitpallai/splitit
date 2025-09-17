import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/express';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (error: any) {
    console.error(error.message);
    res.status(401).json({ success: false, message: 'Invalid token received' });
  }
};

export default authMiddleware;
