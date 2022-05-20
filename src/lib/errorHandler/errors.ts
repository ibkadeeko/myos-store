export class ApplicationError extends Error {
  status: number;
  code: string;
  date: string;
  constructor(message: string, status = 400, code: string) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApplicationError);
    }
    const date = new Date();
    this.name = 'ApplicationError';
    this.code = code;
    this.status = status;
    this.date = date.toISOString();
  }
}

class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super(message, 400, 'BadRequestError');
    this.name = 'BadRequestError';
  }
}

class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
    this.name = 'NotFoundError';
  }
}

class ResourceNotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 404, 'ResourceNotFoundError');
    this.name = 'ResourceNotFoundError';
  }
}

class InternalServerError extends ApplicationError {
  constructor(message: string) {
    super(message, 500, 'InternalServerError');
    this.name = 'InternalServerError';
  }
}

class InternalError extends ApplicationError {
  constructor(message: string) {
    super(message, 500, 'InternalError');
    this.name = 'InternalError';
  }
}

export default {
  BadRequestError,
  NotFoundError,
  ResourceNotFoundError,
  InternalServerError,
  InternalError,
};
