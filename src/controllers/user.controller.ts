import { Request, Response } from 'express';
import { successResponse, validate } from '../lib';
import { authService } from '../services';
import { userDto } from '../dto';

const registerUser = async (req: Request, res: Response) => {
  const dto = await validate<userDto>(req.body, userDto);
  const data = await authService.registerUser(dto);
  return successResponse({
    data,
    res,
    statusCode: 201,
  });
};

const loginUser = async (req: Request, res: Response) => {
  const dto = await validate<userDto>(req.body, userDto);
  const data = await authService.loginUser(dto);
  return successResponse({
    res,
    data,
  });
};

export default {
  registerUser,
  loginUser,
};
