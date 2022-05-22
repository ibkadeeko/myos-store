import * as argon2 from 'argon2';
import { httpErrors } from '../lib';
import { getUserByEmail, getUserByEmailForLogin, createUser } from '../database/dao';
import { userDto } from '../dto';
import { getAuthToken } from '../utils';

const validatePassword = async (email: string, password: string) => {
  const foundUser = await getUserByEmailForLogin(email);
  return foundUser ? argon2.verify(foundUser.password, password) : false;
};

const registerUser = async (dto: userDto) => {
  const { email, password } = dto;

  const foundUser = await getUserByEmail(email);

  if (foundUser) {
    throw new httpErrors.ConflictError('User with this email already exists');
  }

  const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });

  const createdUser = await createUser({
    email,
    password: hashedPassword,
  });

  if (!createdUser) {
    throw new httpErrors.InternalError('Error creating user');
  }

  const token = getAuthToken({ userId: createdUser.id });

  return {
    token,
    user: createdUser,
  };
};

const loginUser = async (dto: userDto) => {
  const { email, password } = dto;

  const foundUser = await getUserByEmail(email);

  if (!foundUser) {
    throw new httpErrors.ResourceNotFoundError('User with this email not found');
  }

  const passwordIsValid = await validatePassword(email, password);
  if (!passwordIsValid) {
    throw new httpErrors.BadRequestError('Invalid Password');
  }

  const token = getAuthToken({ userId: foundUser.id });

  return {
    token,
    user: foundUser,
  };
};

export default {
  registerUser,
  loginUser,
};
