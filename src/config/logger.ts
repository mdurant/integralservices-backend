import winston from 'winston';
import { env } from './env';

const { combine, timestamp, printf, colorize } = winston.format;

const REDACT_PATHS = [
  'req.headers.authorization',
  'password',
  'password_hash',
  'authorization',
  'cookie',
  'req.headers.cookie',
] as const;

function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = current[key];
    if (next === undefined || next === null) return;
    if (typeof next !== 'object' || Array.isArray(next)) return;
    current = next as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

function redact(meta: Record<string, unknown>): Record<string, unknown> {
  const out = JSON.parse(JSON.stringify(meta)) as Record<string, unknown>;
  for (const path of REDACT_PATHS) {
    const parts = path.split('.');
    let current: unknown = out;
    for (let i = 0; i < parts.length - 1 && current != null && typeof current === 'object'; i++) {
      current = (current as Record<string, unknown>)[parts[i]];
    }
    if (current != null && typeof current === 'object' && parts.length > 0) {
      const lastKey = parts[parts.length - 1];
      if (lastKey in (current as object)) {
        setByPath(out, path, '[REDACTED]');
      }
    } else if (parts.length === 1 && parts[0] in out) {
      out[parts[0]] = '[REDACTED]';
    }
  }
  return out;
}

const logFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const safeMeta = redact(meta as Record<string, unknown>);
  const metaStr = Object.keys(safeMeta).length ? ` ${JSON.stringify(safeMeta)}` : '';
  return `${ts} [${level}]: ${message}${metaStr}`;
});

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});

if (env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp(), logFormat),
    })
  );
}
