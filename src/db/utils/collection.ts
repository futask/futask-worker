import { getEnv } from '../../helpers/system';

const convertToSnackCase = (str: string) => str.replace(/([A-Z])/g, (g) => `_${g[0].toLowerCase()}`).slice(1);

export const getCollectionName = (name: string) => convertToSnackCase(name);
