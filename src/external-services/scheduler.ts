import HttpRequest from '../helpers/request';
import { getEnv } from '../helpers/system';
import Task from '../models/task';

const schedulerServer = new HttpRequest(getEnv('APP_SCHEDULER_ENDPOINT') + '/v1.0');

export const getReadyTasks = () => schedulerServer.get<{ tasks?: Task[], processId?: string }>(['consumptions', 'tasks']);

export const markCompletedTasks = (processId: string) =>
  schedulerServer.post(['consumptions', 'tasks', 'completions'], { processId });

export const markFailedTasks = (ids: string[]) =>
  schedulerServer.post(['consumptions', 'tasks', 'failures'], { ids });
