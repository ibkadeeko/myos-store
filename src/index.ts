import 'dotenv/config';
import connectionWrapper from './connectionWrapper';
import startServer from './server';

connectionWrapper(startServer);
