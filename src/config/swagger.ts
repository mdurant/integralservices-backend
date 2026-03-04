import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './env';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Integral Services API',
    version: '1.0.0',
    description: 'API para Integral Services',
  },
  servers: [
    { url: `http://localhost:${env.PORT}`, description: 'Development' },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: { 200: { description: 'OK' } },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  if (!env.SWAGGER_ENABLED) return;
  app.use(env.SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
