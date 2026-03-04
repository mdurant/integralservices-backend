import { Job } from 'bullmq';
import { logger } from '../../config/logger';

export interface ExpireQuotesJobData {
  quoteIds?: string[];
  beforeDate?: string; // ISO date - expirar todas las que venzan antes de esta fecha
}

export async function expireQuotesJob(job: Job<ExpireQuotesJobData>): Promise<void> {
  const { quoteIds, beforeDate } = job.data ?? {};
  logger.info('ExpireQuotes job running', { quoteIds, beforeDate });
  // TODO: llamar a quotesService.expire por cada quote que deba expirar
  // o ejecutar query batch para marcar como expiradas las que validUntil < beforeDate
}
