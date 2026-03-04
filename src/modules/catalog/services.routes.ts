import { Router } from 'express';
import { servicesController } from './services.controller';

const router = Router();

router.get('/', (req, res, next) =>
  servicesController.list(req, res).catch(next)
);
router.get('/:id', (req, res, next) =>
  servicesController.getById(req, res).catch(next)
);
router.post('/', (req, res, next) =>
  servicesController.create(req, res).catch(next)
);
router.patch('/:id', (req, res, next) =>
  servicesController.update(req, res).catch(next)
);
router.delete('/:id', (req, res, next) =>
  servicesController.delete(req, res).catch(next)
);

export const servicesRoutes = router;
