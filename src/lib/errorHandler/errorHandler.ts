import { Response, Request, NextFunction } from 'express';

import { ApplicationError } from './errors';
import { errorResponse } from '../httpResponse';

export const errorHandler = (error: ApplicationError, request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    return next(error);
  }

  const { message, status: statusCode, code } = error;

  return errorResponse({ req: request, res: response, code, message, statusCode });
};
