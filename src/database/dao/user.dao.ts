import { QueryRunner } from 'typeorm';
import { getRepoWithQueryRunner } from './dao.util';
import { User } from '../entities';

export const getUserByEmail = async (email: string, qr?: QueryRunner) => {
  return getRepoWithQueryRunner(User, qr).findOne({ email: email.toLowerCase() });
};

export const getUserById = async (id: string, qr?: QueryRunner) => {
  return getRepoWithQueryRunner(User, qr).findOne({ id });
};

export const getUserByEmailForLogin = async (email: string, qr?: QueryRunner) => {
  return getRepoWithQueryRunner(User, qr)
    .createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', { email: email.toLowerCase() })
    .getOne();
};

export const createUser = async (data: Pick<User, 'email' | 'password'>, qr?: QueryRunner) => {
  const userRepository = getRepoWithQueryRunner(User, qr);
  const createdUser = await userRepository.save(userRepository.create(data));
  return getUserById(createdUser.id, qr);
};
