import { Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from './logger';

export const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'mysql',
  logging: env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
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
