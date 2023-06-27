import logger from '../helpers/logger';
import { getEnv } from '../helpers/system';
import { getReadyTasks, markCompletedTasks } from '../external-services/scheduler';
import Task from '../models/task';
import HttpRequest from '../helpers/request';

const executeTask = (task: Task) => {
  const url = task.payload.callbackUrl || getEnv('DEFAULT_CALLBACK_URL');
  if (!url) {
    return Promise.resolve('');
  }

  return new HttpRequest(url)
    .post([], task.payload.data)
    .then(() => '')
    .catch(() => task._id);
}

const executeTasks = (tasks: Task[]) => Promise.all(tasks.map(executeTask)).then(ids => ids.filter(Boolean));

const digestTasks = async () => {
  const { tasks, processId } = await getReadyTasks().catch(err => {
    return { tasks: [], processId: '' }
  });

  if (!tasks || !tasks.length || !processId) {
    return;
  }

  return executeTasks(tasks)
    .then(failureIds => markCompletedTasks(processId!, failureIds));
}

const isJobFinished = () => +getEnv('JOB_FINISHED');

const runJob = async () => {
  if (isJobFinished()) {
    return process.exit(0);
  }

  /**
   * We need to execute a macro task for other micro tasks can be executed if they appeared, eg: request to this server,..
   */
  const runNextJob = () => setTimeout(() => runJob());

  digestTasks()
    .catch(err => {
      logger.error('🛑 digest tasks error:', err);
    })
    .finally(runNextJob);
}

export default runJob;
