import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../shared/security/authMiddleware';
import { requireRoleMiddleware } from '../../shared/security/requireRole';
import { servicesController } from './services.controller';

const router = Router();
const adminOnly = [authMiddleware, requireRoleMiddleware('ADMIN')];

router.get('/', adminOnly, (req: Request, res: Response, next: NextFunction) =>
  servicesController.list(req, res).catch(next)
);
router.get('/:id', adminOnly, (req: Request, res: Response, next: NextFunction) =>
  servicesController.getById(req, res).catch(next)
);
router.post('/', adminOnly, (req: Request, res: Response, next: NextFunction) =>
  servicesController.create(req, res).catch(next)
);
router.patch('/:id', adminOnly, (req: Request, res: Response, next: NextFunction) =>
  servicesController.update(req, res).catch(next)
);
router.delete('/:id', adminOnly, (req: Request, res: Response, next: NextFunction) =>
  servicesController.delete(req, res).catch(next)
);

export const servicesRoutes = router;
