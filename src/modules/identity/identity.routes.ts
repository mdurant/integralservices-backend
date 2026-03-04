import { Router } from 'express';
import { identityController } from './identity.controller';

const router = Router();

router.post('/login', (req, res, next) =>
  identityController.login(req, res).catch(next)
);
router.post('/register', (req, res, next) =>
  identityController.register(req, res).catch(next)
);
router.post('/refresh', (req, res, next) =>
  identityController.refreshToken(req, res).catch(next)
);

export const identityRoutes = router;
