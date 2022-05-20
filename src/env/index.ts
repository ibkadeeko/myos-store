import { generalLogger } from '../lib';

export enum envEnum {
  DEV = 'development',
  PROD = 'production',
  STAGING = 'staging',
  TESTING = 'test',
}

export interface EnvStore {
  NODE_ENV: string;
}

export const envStore: EnvStore = {
  NODE_ENV: envEnum.DEV,
};

const setEnvStoreFromEnvironment = () => {
  Object.keys(envStore).forEach((envVar: keyof EnvStore) => {
    if (process.env[envVar]) {
      envStore[envVar] = process.env[envVar] || '';
    }
  });
};

export const configureENV = async (): Promise<void> => {
  setEnvStoreFromEnvironment();
  const emptyDataResults = Object.keys(envStore).filter((envVar: keyof EnvStore) => envStore[envVar] === '');

  if (emptyDataResults.length > 0) {
    generalLogger.error(`The following environmental variables are missing: ${emptyDataResults.join(', ')}`);
    process.exit(1);
  }
};
