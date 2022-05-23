import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { httpErrors } from '../../lib';
import { envStore } from '../../env';
import { getUserById } from '../../database/dao';

export interface DecodedToken {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  decodedToken: DecodedToken;
}

const generateToken = (payload: any, expiryTime: string) => {
  return jwt.sign(payload, envStore.JWT_SECRET, { expiresIn: expiryTime });
};

export const getAuthToken = (payload: any) => {
  return generateToken(payload, envStore.JWT_EXPIRY_TIME);
};

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new httpErrors.UnauthorizedError('No token Provided');
    }

    if (authorization.split(' ')[0] !== 'Bearer') {
      throw new httpErrors.UnauthorizedError('Invalid token supplied');
    }

    const [, token] = authorization.split(' ');

    const decodedToken: any = jwt.verify(token, envStore.JWT_SECRET);

    const { userId } = decodedToken;

    if (!userId) {
      throw new httpErrors.UnauthorizedError('Invalid token supplied');
    }

    const foundUser = await getUserById(userId);

    if (!foundUser) {
      throw new httpErrors.UnauthorizedError('Invalid token supplied');
    }

    req.decodedToken = decodedToken;

    return next();
  } catch (error) {
    return next(error);
  }
};
