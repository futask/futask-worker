import logger from '../helpers/logger';
import { getEnv } from '../helpers/system';
import { getReadyTasks, markCompletedTasks } from '../external-services/scheduler';
import Task from '../models/task';

const executeTasks = (tasks: Task[]) => Promise.resolve(tasks);
const digestTasks = async () => {
  const { tasks, processId } = await getReadyTasks().catch(err => {
    return { tasks: [], processId: '' }
  });

  if (!tasks || !tasks.length) {
    return;
  }
  return executeTasks(tasks)
    .then(() => markCompletedTasks(processId!));
}

const isJobFinished = () => +getEnv('JOB_FINISHED');

const runJob = async () => {
  logger.info('🚀 start running task')
  if (isJobFinished()) {
    logger.info('✅ Stop')
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
