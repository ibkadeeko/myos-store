import { EntityTarget, getRepository, QueryRunner, Repository } from 'typeorm';

export const getRepoWithQueryRunner = <T>(entity: EntityTarget<T>, qr?: QueryRunner): Repository<T> => {
  return qr ? qr.manager.getRepository(entity) : getRepository(entity);
};
