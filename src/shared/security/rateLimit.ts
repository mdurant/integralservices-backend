import rateLimitLib from 'express-rate-limit';
import { env } from '../../config/env';

export const rateLimit = rateLimitLib({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: { error: { message: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' } },
  standardHeaders: true,
  legacyHeaders: false,
});
