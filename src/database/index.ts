import { Connection, createConnection } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormConfig = require('./config');

const createDatabaseConnection = async (): Promise<Connection> => {
  const config = await ormConfig;
  return createConnection(config);
};

export default createDatabaseConnection;
