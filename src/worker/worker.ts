import { Worker } from 'bullmq';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { expireQuotesJob } from './jobs/expireQuotes.job';

const redisUrl = env.REDIS_URL ?? 'redis://localhost:6379';
const connection = {
  host: new URL(redisUrl).hostname,
  port: parseInt(new URL(redisUrl).port || '6379', 10),
};

const QUEUE_NAME = 'integralservices';

export function startWorker(): Worker {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      logger.info(`Processing job ${job.name} (${job.id})`);
      switch (job.name) {
        case 'expireQuotes':
          await expireQuotesJob(job);
          break;
        default:
          logger.warn(`Unknown job type: ${job.name}`);
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed:`, err);
  });

  logger.info('Worker started');
  return worker;
}

if (require.main === module) {
  startWorker();
}
