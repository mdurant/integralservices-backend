import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { identityController } from './identity.controller';
import { authMiddleware } from '../../shared/security/authMiddleware';
import { env } from '../../config/env';
import { Nationality, Sex, Region, Commune } from '../../models';

const router = Router();

const uploadDir = path.join(process.cwd(), env.UPLOAD_DIR ?? 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: unknown, _file: unknown, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: unknown, file: { originalname: string }, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `profile-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Públicas
router.post('/register', (req, res, next) => identityController.register(req, res).catch(next));
router.post('/activate', (req, res, next) => identityController.activateEmail(req, res).catch(next));
router.post('/send-otp', (req, res, next) => identityController.sendOtp(req, res).catch(next));
router.post('/verify-otp', (req, res, next) => identityController.verifyOtp(req, res).catch(next));
router.post('/login', (req, res, next) => identityController.login(req, res).catch(next));
router.post('/refresh', (req, res, next) => identityController.refreshToken(req, res).catch(next));
router.post('/forgot-password', (req, res, next) => identityController.forgotPassword(req, res).catch(next));
router.post('/reset-password', (req, res, next) => identityController.resetPassword(req, res).catch(next));
router.post('/verify-contact-change', (req, res, next) => identityController.verifyContactChange(req, res).catch(next));

// Listados para perfil (desde BD: seeders de nationalities, sexes, regions, communes)
router.get('/nacionalidades', async (_req, res, next) => {
  try {
    const list = await Nationality.findAll({ order: [['label', 'ASC']], attributes: ['code', 'label'] });
    res.json({ data: list.map((r) => ({ value: r.code, label: r.label })) });
  } catch (e) {
    next(e);
  }
});
router.get('/sexes', async (_req, res, next) => {
  try {
    const list = await Sex.findAll({ order: [['id', 'ASC']], attributes: ['code', 'label'] });
    res.json({ data: list.map((r) => ({ value: r.code, label: r.label })) });
  } catch (e) {
    next(e);
  }
});
router.get('/regions', async (_req, res, next) => {
  try {
    const list = await Region.findAll({ order: [['code', 'ASC']], attributes: ['code', 'name'] });
    res.json({ data: list.map((r) => ({ code: r.code, name: r.name })) });
  } catch (e) {
    next(e);
  }
});
router.get('/communes', async (req, res, next) => {
  try {
    const regionCode = req.query.regionCode as string | undefined;
    const where = regionCode ? { region_code: regionCode } : {};
    const list = await Commune.findAll({ where, order: [['name', 'ASC']], attributes: ['code', 'name', 'region_code'] });
    res.json({ data: list.map((r) => ({ code: r.code, name: r.name, regionCode: r.region_code })) });
  } catch (e) {
    next(e);
  }
});
router.get('/actividades-ofertadas', (_req, res) => {
  const data = require('./data/actividades-ofertadas.json');
  res.json({ data });
});

// Protegidas con JWT
router.get('/profile', authMiddleware, (req, res, next) => identityController.getProfile(req as any, res).catch(next));
router.patch('/profile', authMiddleware, (req, res, next) => identityController.updateProfile(req as any, res).catch(next));
router.get('/dashboard', authMiddleware, (req, res, next) => identityController.getDashboard(req as any, res).catch(next));
router.post('/deactivate', authMiddleware, (req, res, next) => identityController.deactivateAccount(req as any, res).catch(next));
router.post('/profile/image', authMiddleware, upload.single('image'), (req, res, next) => identityController.uploadProfileImage(req as any, res).catch(next));

export const identityRoutes = router;
