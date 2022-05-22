import { getConnection, QueryRunner } from 'typeorm';

export const getQueryRunner = async (): Promise<QueryRunner> => {
  const connection = getConnection();

  const qr = connection.createQueryRunner();
  await qr.connect();

  return qr;
};
