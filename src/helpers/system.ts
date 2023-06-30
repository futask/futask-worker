type EnvKey =
  // system report env
  'PROCESSED_TASK_COUNT' |

  'PORT' |
  'APP_MONGODB_URI' |
  'OVERDUE_PROCESSING_MS' |
  'JOB_FINISHED' |
  'DEFAULT_CALLBACK_URL';

export const getEnv = (name: EnvKey): string => {
  const value = process.env[name];

  if (!value && process.env.APP_ENV === 'development') {
    console.log(`🔥 DBG::Missing env ${name}`);
  }

  return value || '';
};

export const setEnv = (name: EnvKey, value: string) => {
  process.env[name] = value;
};

export const getEnvNumber = (name: EnvKey) => Number(getEnv(name) || 0);

export const setEnvNumber = (name: EnvKey, value: number) => setEnv(name, String(value || 0));

export const incEnv = (name: EnvKey, count: number) => setEnvNumber(name, getEnvNumber(name) + (count || 0));
