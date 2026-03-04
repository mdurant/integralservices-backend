import { Request, Response, NextFunction } from 'express';
import { logger } from '../../config/logger';

/**
 * Debe ir después de requestContextMiddleware para tener req.ctx.requestId.
 */
export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const requestId = req.ctx?.requestId ?? '-';
    logger.info('HTTP request', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      userId: req.ctx?.userId ?? '-',
      tenantId: req.ctx?.tenantId ?? '-',
      companyId: req.ctx?.companyId ?? '-',
      role: req.ctx?.role ?? '-',
    });
  });

  next();
}
