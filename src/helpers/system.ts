type EnvKey =
  'JOB_FINISHED' |
  'DEFAULT_CALLBACK_URL' |
  'APP_SCHEDULER_ENDPOINT';

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
