import { Router } from 'express';
import { quotesController } from './quotes.controller';

const router = Router();

router.get('/', (req, res, next) =>
  quotesController.list(req, res).catch(next)
);
router.get('/:id', (req, res, next) =>
  quotesController.getById(req, res).catch(next)
);
router.post('/', (req, res, next) =>
  quotesController.create(req, res).catch(next)
);
router.patch('/:id', (req, res, next) =>
  quotesController.update(req, res).catch(next)
);
router.post('/:id/expire', (req, res, next) =>
  quotesController.expire(req, res).catch(next)
);

export const quotesRoutes = router;
