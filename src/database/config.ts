import 'dotenv/config';
import { envStore, configureENV } from '../env';

const entities = [`${__dirname}/entities/*.ts`, `${__dirname}/entities/*.js`];
const migrations = [`${__dirname}/migrations/*.ts`, `${__dirname}/migrations/*.js`];

const ormConfig = async () => {
  await configureENV();

  let options = {
    type: envStore.DATABASE_TYPE as any,
    host: envStore.DATABASE_HOST,
    port: Number(envStore.DATABASE_PORT as any),
    username: envStore.DATABASE_USERNAME,
    password: envStore.DATABASE_PASSWORD,
    database: envStore.DATABASE_NAME,
  } as any;

  if (process.env.NODE_ENV === 'test') {
    options = {
      host: envStore.TEST_DATABASE_HOST,
      database: envStore.TEST_DATABASE_NAME,
      type: envStore.DATABASE_TYPE as any,
      port: Number(envStore.DATABASE_PORT as any),
      username: envStore.DATABASE_USERNAME,
      password: envStore.DATABASE_PASSWORD,
    } as any;
  }

  if (process.env.DATABASE_URL) {
    options = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  const config = {
    ...options,
    entities,
    migrations,
    migrationsRun: process.env.NODE_ENV !== 'test',
    cli: {
      migrationsDir: `src/database/migrations`,
    },
    synchronize: process.env.NODE_ENV === 'test',
    dropSchema: process.env.NODE_ENV === 'test',
    logging: envStore.DB_LOGGING === 'true' && process.env.NODE_ENV !== 'test' ? ['query', 'error'] : [],
    seeds: ['src/database/seeding/seeds/**/*{.ts,.js}'],
    factories: ['src/database/seeding/factories/**/*{.ts,.js}'],
  };

  return config;
};

module.exports = ormConfig();
