import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env } from './config/env';
import { errorMiddleware } from './shared/errors/errorMiddleware';
import { requestContextMiddleware } from './shared/observability/requestContext';
import { httpLogger } from './shared/observability/httpLogger';
import { rateLimit } from './shared/security/rateLimit';
import { setupSwagger } from './config/swagger';
import { identityRoutes } from './modules/identity/identity.routes';
import { servicesRoutes } from './modules/catalog/services.routes';
import { quotesRoutes } from './modules/quotes/quotes.routes';
import { geographyRoutes } from './modules/geography/geography.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN ?? '*' }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestContextMiddleware);
app.use(httpLogger);

if (env.RATE_LIMIT_ENABLED) {
  app.use(rateLimit);
}

setupSwagger(app);

const apiPrefix = env.API_PREFIX ?? '/api/v1';
app.use(`${apiPrefix}/identity`, identityRoutes);
app.use(`${apiPrefix}/services`, servicesRoutes);
app.use(`${apiPrefix}/quotes`, quotesRoutes);
app.use(`${apiPrefix}/geography`, geographyRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorMiddleware);

export { app };
