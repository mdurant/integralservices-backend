import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { HttpError } from '../errors/httpError';

const CTX_ROLES = ['ADMIN', 'TECH', 'CLIENT'] as const;
type CtxRole = (typeof CTX_ROLES)[number];

function toCtxRole(role?: string): CtxRole | undefined {
  return role && CTX_ROLES.includes(role as CtxRole) ? (role as CtxRole) : undefined;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  tenantId?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw HttpError.unauthorized('Missing or invalid Authorization header');
  }

  const token = authHeader.slice(7);
  try {
    const secret = env.JWT_ACCESS_SECRET ?? env.JWT_SECRET;
    const decoded = jwt.verify(token, secret!) as JwtPayload;
    req.user = decoded;
    if (req.ctx) {
      req.ctx.userId = decoded.sub;
      req.ctx.tenantId = decoded.tenantId;
      req.ctx.companyId = decoded.tenantId;
      req.ctx.role = toCtxRole(decoded.roles?.[0]);
    }
    next();
  } catch {
    throw HttpError.unauthorized('Invalid or expired token');
  }
}
