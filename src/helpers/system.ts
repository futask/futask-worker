type EnvKey =
  'JOB_FINISHED' |
  'SCHEDULER_ENDPOINT';

export const getEnv = (name: EnvKey): string => {
  const value = process.env[name];
  if (!value) {
    console.log(`🔥 DBG::Missing env ${name}`);
  }

  return value || '';
};
