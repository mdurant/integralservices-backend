import { Router } from 'express';
import { geographyController } from './geography.controller';

const router = Router();

router.get('/regions', (req, res, next) =>
  geographyController.getRegions(req, res).catch(next)
);
router.get('/provinces', (req, res, next) =>
  geographyController.getProvinces(req, res).catch(next)
);
router.get('/communes', (req, res, next) =>
  geographyController.getCommunes(req, res).catch(next)
);
router.get('/my-ip', (req, res, next) =>
  geographyController.getMyIp(req, res).catch(next)
);
router.get('/holidays', (req, res, next) =>
  geographyController.getHolidays(req, res).catch(next)
);

export const geographyRoutes = router;
