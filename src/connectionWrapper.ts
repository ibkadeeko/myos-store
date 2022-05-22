import { configureENV } from './env';
import { generalLogger } from './lib';
import { Connection } from 'typeorm';
import createDatabaseConnection from './database';

const connectionWrapper = async (body: (connection: Connection) => void) => {
  try {
    await configureENV();
    const connection = await createDatabaseConnection();
    body(connection);
  } catch (error) {
    generalLogger.error(`Error Starting Application: ${error.message}`);
    process.exit(1);
  }
};

export default connectionWrapper;
