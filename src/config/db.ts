import { Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from './logger';

export const sequelize = new Sequelize(env.DB_NAME ?? 'integralservices', env.DB_USER ?? 'root', env.DB_PASS ?? 'root', {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false,
  dialectOptions: { dateStrings: true },
});

export async function connectDb(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established.');
  } catch (err) {
    logger.error('Unable to connect to the database:', err);
    throw err;
  }
}

export async function disconnectDb(): Promise<void> {
  await sequelize.close();
  logger.info('Database connection closed.');
}
