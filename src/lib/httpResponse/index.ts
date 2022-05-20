import { Request, Response } from 'express';

import { routerResponseLogger } from '../logger';

export enum applicationMessages {
  ERROR_RESPONSE_MESSAGE = 'Request failed',
  EXCEPTION_RESPONSE_MESSAGE = 'Unexpected application error',
  HEALTH_CHECK_MESSAGE = 'Health check',
}

type successResponseInputType = {
  res: Response;
  data?: any;
  statusCode?: number;
};

type errorResponseInputType = {
  req: Request;
  res: Response;
  code?: any;
  message?: string;
  statusCode?: number;
};

export const successResponse = ({ res, data, statusCode }: successResponseInputType) => {
  const responseBody = data || {};
  return res.status(statusCode || 200).send(responseBody);
};

export const errorResponse = ({ req, res, code, message, statusCode }: errorResponseInputType) => {
  const responseMessage = message || applicationMessages.ERROR_RESPONSE_MESSAGE;
  const errorCode = code || 'INTERNAL_SERVER_ERROR';
  const responseBody = {
    code: errorCode,
    message: responseMessage,
  };

  routerResponseLogger.error(responseMessage, {
    url: req.originalUrl,
    code: errorCode,
  });

  return res.status(statusCode || 500).send(responseBody);
};
