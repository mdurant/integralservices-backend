import { Request, Response, NextFunction } from 'express';
import { requestContext, createRequestId } from './requestContext';
import { logger } from '../../config/logger';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) ?? createRequestId();
  req.headers['x-request-id'] = requestId;

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP request', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
    });
  });

  requestContext.run({ requestId }, () => next());
}
