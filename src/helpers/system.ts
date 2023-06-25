type EnvKey =
  'JOB_FINISHED' |
  'APP_SCHEDULER_ENDPOINT';

export const getEnv = (name: EnvKey): string => {
  const value = process.env[name];
  if (!value) {
    console.log(`🔥 DBG::Missing env ${name}`);
  }

  return value || '';
};

export const setEnv = (name: EnvKey, value: string) => {
  process.env[name] = value;
};
