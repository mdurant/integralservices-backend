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
// CORS: permitir origen del cliente; por defecto FRONTEND_URL o * (backend y enlaces en :3000)
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

// Páginas de enlaces de correo (activación y reset) en :3000
app.get('/auth/activate', (req, res) => {
  const token = (req.query.token as string) || '';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Activar cuenta</title></head><body>
  <div id="msg">Activando cuenta...</div>
  <script>
    var token = ${JSON.stringify(token)};
    if (!token) { document.getElementById('msg').innerHTML = '<p>Falta el token en la URL.</p>'; } else {
      fetch('${apiPrefix}/identity/activate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token }) })
        .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
        .then(function(x) { document.getElementById('msg').innerHTML = x.ok ? '<p><strong>' + (x.data.message || 'Cuenta activada.</strong></p><p>Revisa tu correo para el código OTP.</p>') : '<p>Error: ' + (x.data.error && x.data.error.message ? x.data.error.message : x.data.message || 'Enlace inválido o expirado') + '</p>'; })
        .catch(function() { document.getElementById('msg').innerHTML = '<p>Error de conexión.</p>'; });
    }
  </script></body></html>`;
  res.type('html').send(html);
});
app.get('/auth/reset-password', (req, res) => {
  const token = (req.query.token as string) || '';
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Restablecer contraseña</title></head><body>
  <h2>Restablecer contraseña</h2>
  <div id="msg"></div>
  <form id="f" style="display:${token ? 'block' : 'none'}">
    <input type="hidden" name="token" value="${token.replace(/"/g, '&quot;')}">
    <p>Nueva contraseña: <input type="password" name="newPassword" required></p>
    <p>Repetir: <input type="password" name="rePassword" required></p>
    <button type="submit">Enviar</button>
  </form>
  ${!token ? '<p>Falta el token en la URL.</p>' : ''}
  <script>
    document.getElementById('f').onsubmit = function(e) {
      e.preventDefault();
      var fd = new FormData(this);
      var body = { token: fd.get('token'), newPassword: fd.get('newPassword'), rePassword: fd.get('rePassword') };
      fetch('${apiPrefix}/identity/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function(r) { return r.json().then(function(d) { return { ok: r.ok, data: d }; }); })
        .then(function(x) { document.getElementById('msg').innerHTML = x.ok ? '<p><strong>' + (x.data.message || 'Contraseña actualizada. Inicia sesión.</strong></p>' : '<p>Error: ' + (x.data.error && x.data.error.message ? x.data.error.message : '') + '</p>'; document.getElementById('f').style.display = 'none'; })
        .catch(function() { document.getElementById('msg').innerHTML = '<p>Error de conexión.</p>'; });
      return false;
    };
  </script></body></html>`;
  res.type('html').send(html);
});

const uploadDir = env.UPLOAD_DIR ?? 'uploads';
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

app.use(errorMiddleware);

export { app };
