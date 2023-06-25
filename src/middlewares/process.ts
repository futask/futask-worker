import { NextFunction, Request, Response } from 'express';
import { setEnv } from '../helpers/system';

export const stopJob = (_: Request, res: Response, next: NextFunction) => {
  setEnv('JOB_FINISHED', '1');
  next();
}
