import { Response, NextFunction } from 'express';
import { HttpError } from '../errors/httpError';
import { AuthenticatedRequest } from './authMiddleware';

/**
 * Middleware que asegura que el tenantId del request coincida con el del usuario autenticado.
 * Útil en contextos multi-tenant para evitar acceso cross-tenant.
 */
export function tenantGuard(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const userTenantId = req.user?.tenantId;
  const requestTenantId = req.headers['x-tenant-id'] as string | undefined;

  if (!userTenantId) {
    next();
    return;
  }

  if (requestTenantId && requestTenantId !== userTenantId) {
    throw HttpError.forbidden('Tenant mismatch');
  }

  next();
}
