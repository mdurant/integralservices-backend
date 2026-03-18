import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { identityController } from './identity.controller';
import { authMiddleware } from '../../shared/security/authMiddleware';
import { env } from '../../config/env';

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
router.post('/logout', (req, res, next) => identityController.logout(req, res).catch(next));
router.post('/forgot-password', (req, res, next) => identityController.forgotPassword(req, res).catch(next));
router.post('/reset-password', (req, res, next) => identityController.resetPassword(req, res).catch(next));

// Datos estáticos (públicos para el formulario de perfil)
router.get('/nacionalidades', (_req, res) => {
  const { NACIONALIDADES } = require('./data/nacionalidades');
  res.json({ data: NACIONALIDADES });
});
router.get('/actividades-ofertadas', (_req, res) => {
  const data = require('./data/actividades-ofertadas.json');
  res.json({ data });
});

// Protegidas con JWT
router.post('/logout-all', authMiddleware, (req, res, next) => identityController.logoutAll(req as any, res).catch(next));
router.get('/profile', authMiddleware, (req, res, next) => identityController.getProfile(req as any, res).catch(next));
router.patch('/profile', authMiddleware, (req, res, next) => identityController.updateProfile(req as any, res).catch(next));
router.get('/dashboard', authMiddleware, (req, res, next) => identityController.getDashboard(req as any, res).catch(next));
router.post('/deactivate', authMiddleware, (req, res, next) => identityController.deactivateAccount(req as any, res).catch(next));
router.post('/profile/image', authMiddleware, upload.single('image'), (req, res, next) => identityController.uploadProfileImage(req as any, res).catch(next));

export const identityRoutes = router;
