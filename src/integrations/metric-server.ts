import logger from '../helpers/logger';
import { getEnvNumber, incEnv } from '../helpers/system';

export const notifyProcessedTasks = (count: number) => {
  if (!count) {
    return;
  }
  incEnv('PROCESSED_TASK_COUNT', count);
  logger.info('✅ PROCESSED: %o', getEnvNumber('PROCESSED_TASK_COUNT'));
};
