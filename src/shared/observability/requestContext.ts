import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

// Extensión de Express.Request para acceso tipado a req.ctx
declare global {
  namespace Express {
    interface Request {
      ctx: RequestContext;
    }
  }
}

export interface RequestContext {
  requestId: string;
  userId?: string;
  tenantId?: string;
  companyId?: string;
  role?: 'ADMIN' | 'TECH' | 'CLIENT';
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Middleware que asigna req.ctx (requestId desde header o nuevo UUID) y corre la cadena dentro de AsyncLocalStorage.
 * Así tanto req.ctx como getRequestContext() exponen el mismo contexto (auth puede completar userId, tenantId, role después).
 */
export function requestContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const requestId = (req.header('x-request-id') as string) || randomUUID();
  req.headers['x-request-id'] = requestId;

  req.ctx = {
    requestId,
  };

  asyncLocalStorage.run(req.ctx, () => next());
}

/** Alias para compatibilidad con código que espera el storage por nombre */
export const requestContext = asyncLocalStorage;

export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}

export function getRequestId(): string | undefined {
  return getRequestContext()?.requestId;
}

export function createRequestId(): string {
  return randomUUID();
}
