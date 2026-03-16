import { Request, Response, NextFunction } from 'express';
import { HttpError } from './httpError';
import { logger } from '../../config/logger';

export function errorMiddleware(
  err: Error & { statusCode?: number; type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
    return;
  }

  // JSON inválido en el body (p. ej. "email": test@example.com sin comillas)
  const isJsonParseError = err.type === 'entity.parse.failed' || (err.message && err.message.includes('is not valid JSON'));
  if (err.statusCode === 400 && isJsonParseError) {
    res.status(400).json({
      error: {
        message: 'Body inválido. Debe ser JSON válido (los textos, como email, entre comillas dobles). Ej: "email": "test@example.com"',
        code: 'INVALID_JSON',
      },
    });
    return;
  }

  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    },
  });
}
