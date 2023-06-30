import logger from '../helpers/logger';
import { getEnv } from '../helpers/system';
import Task from '../models/task';
import HttpRequest from '../helpers/request';
import * as TaskCollection from '../db/task';
import uuid from '../helpers/uuid';
import { nowMs } from '../helpers/datetime';
import { notifyProcessedTasks } from '../integrations/metric-server';

const flagProcessingTasks = async (processId: string, amount: number) => {
  const tasks = await TaskCollection.findAvailable(amount, { fields: ['_id'] });

  return TaskCollection.updateManyById(tasks.map(t => t._id), { _processingId: processId, _processingAt: nowMs() });
}

const getConsumptionTasks = async (amount: number) => {
  const processId = uuid();

  await flagProcessingTasks(processId, amount);

  return TaskCollection.find({ _processingId: processId }, { fields: ['payload']}).then(tasks => ({ tasks, processId }));
}

const flagConsumptionSuccess = async (processId: string, failureIds?: string[]) => {
  if (failureIds?.length) {
    await TaskCollection.markFailed(failureIds);
  }

  return TaskCollection.markCompleted(processId)
    .then(count => notifyProcessedTasks(count))
    .catch(err => logger.error('🛑 delete tasks failed, err: %o, ids: %o', err.message));
};

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
  const DEFAULT_CUNSUMPTION_AMOUNT = 500;
  const { tasks, processId } = await getConsumptionTasks(DEFAULT_CUNSUMPTION_AMOUNT).catch(err => {
    return { tasks: [], processId: '' }
  });

  if (!tasks || !tasks.length || !processId) {
    return;
  }

  return executeTasks(tasks)
    .then(failureIds => flagConsumptionSuccess(processId!, failureIds));
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
