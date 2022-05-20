import express, { json, urlencoded, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
require('express-async-errors');
import 'dotenv/config';

import routes from './routes';
import { generalLogger, httpErrors, errorHandler, applicationMessages, successResponse } from './lib';

const app = express();

app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const stream = {
  write: (text: string) => generalLogger.http(text),
};

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'local' ? 'dev' : 'combined', { stream }));
}

app.use(routes);
app.get('/', (req: Request, res: Response) => res.status(200).send('200 OK'));
app.get('/health', (req: Request, res: Response) => {
  return successResponse({
    res,
    data: {
      message: applicationMessages.HEALTH_CHECK_MESSAGE,
    },
  });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.all('*', (req: Request, res: Response) => {
  throw new httpErrors.NotFoundError(`Can't find route [ ${req.method} ${req.originalUrl} ] on this server`);
});
app.use(errorHandler);

export default app;
