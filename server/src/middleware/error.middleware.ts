import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Server error' });
};

export default errorMiddleware;