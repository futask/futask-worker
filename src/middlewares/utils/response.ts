import { NextFunction, Request, Response } from 'express';

// export a middleware function for handling response from res.locals.data
export const response = (_: Request, res: Response, next: NextFunction) => {
  res.json(res.locals.data);
  next();
}

export const attachResponseData = (res: Response, data: any) => {
  if (!res.locals.data) {
    res.locals.data = {};
  }
  Object.assign(res.locals.data, data);
}
