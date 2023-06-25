import express, { Express, NextFunction, Request, Response } from 'express';
import appRouter from './src/routes';
import dotenv from 'dotenv';
import logger from './src/helpers/logger';
import executeTasks from './src/lib/task-execution';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/ver', (req: Request, res: Response) => {
  res.json({ build: process.env.BUILD_NUMBER, at: process.env.BUILD_DATE, version: process.env.BUILD_VERSION });
});

app.use('/', appRouter)

app.use((err: Error & { status?: number }, request: Request, res: Response, next: NextFunction) => {
  logger.error(err, `🔴 Exception error: ${request.originalUrl}`);
  const SERVER_ERROR_CODE = 500;
  const status = err.status || SERVER_ERROR_CODE;

  res.status(status).json({ error: err.message || 'Internal server error.' });
  next();
});

app.listen(port, () => {
  logger.info(`✅ [server]: Server is running at http://localhost:${port}`);
});

executeTasks();

process.on('unhandledRejection', err => {
  logger.error('🛑 DBG::Unhandled Rejection at: %o', err);
});

process.on('uncaughtException', err => {
  logger.error('🛑 DBG::Uncaught Exception thrown %o', err.message);
});
