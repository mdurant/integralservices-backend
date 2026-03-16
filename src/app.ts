import express from 'express';
import path from 'path';
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
// En desarrollo: permitir frontend (p. ej. Angular en :4200); CORS_ORIGIN o FRONTEND_URL
const corsOrigin = env.CORS_ORIGIN ?? env.FRONTEND_URL ?? '*';
app.use(cors({ origin: corsOrigin }));
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

const uploadDir = env.UPLOAD_DIR ?? 'uploads';
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

app.use(errorMiddleware);

export { app };
