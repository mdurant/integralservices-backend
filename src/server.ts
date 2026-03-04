import { app } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDb, disconnectDb } from './config/db';

let server: ReturnType<typeof app.listen>;

async function start(): Promise<void> {
  await connectDb();
  server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Closing server...`);
  server?.close(async () => {
    await disconnectDb();
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

start().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { server };
