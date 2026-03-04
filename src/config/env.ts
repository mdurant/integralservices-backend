import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
}

function getEnvOptional(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue;
}

export const env = {
  NODE_ENV: getEnvOptional('NODE_ENV', 'development') as string,
  PORT: parseInt(getEnvOptional('PORT', '3000') ?? '3000', 10),
  API_PREFIX: getEnvOptional('API_PREFIX', '/api/v1'),
  DATABASE_URL: getEnvOptional('DATABASE_URL', 'mysql://root:root@localhost:3306/integralservices'),
  DB_HOST: getEnvOptional('DB_HOST', 'localhost'),
  DB_PORT: parseInt(getEnvOptional('DB_PORT', '3306') ?? '3306', 10),
  DB_NAME: getEnvOptional('DB_NAME', 'integralservices'),
  DB_USER: getEnvOptional('DB_USER', 'root'),
  DB_PASS: getEnvOptional('DB_PASS', 'root'),
  REDIS_URL: getEnvOptional('REDIS_URL', 'redis://localhost:6379'),
  JWT_SECRET: getEnvOptional('JWT_SECRET', 'dev-secret-change-in-production'),
  JWT_EXPIRES_IN: getEnvOptional('JWT_EXPIRES_IN', '7d'),
  TZ: getEnvOptional('TZ', 'America/Santiago'),
  LOG_LEVEL: getEnvOptional('LOG_LEVEL', 'info'),
  SWAGGER_ENABLED: getEnvOptional('SWAGGER_ENABLED', 'true') === 'true',
  SWAGGER_PATH: getEnvOptional('SWAGGER_PATH', '/api-docs'),
  RATE_LIMIT_ENABLED: getEnvOptional('RATE_LIMIT_ENABLED', 'true') === 'true',
  RATE_LIMIT_WINDOW_MS: parseInt(getEnvOptional('RATE_LIMIT_WINDOW_MS', '60000') ?? '60000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(getEnvOptional('RATE_LIMIT_MAX_REQUESTS', '100') ?? '100', 10),
  CORS_ORIGIN: getEnvOptional('CORS_ORIGIN'),
};
