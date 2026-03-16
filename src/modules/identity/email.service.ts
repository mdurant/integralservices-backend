import { env } from '../../config/env';
import { notificationsService } from '../notifications/notifications.service';
import { logger } from '../../config/logger';

const FRONTEND_URL = env.FRONTEND_URL ?? 'http://localhost:3000';

export async function sendActivationEmail(email: string, token: string): Promise<void> {
  const link = `${FRONTEND_URL}/auth/activate?token=${encodeURIComponent(token)}`;
  const body = `Hola,\n\nPara activar tu cuenta haz clic en el siguiente enlace (válido 24h):\n\n${link}\n\nSaludos.`;
  try {
    await notificationsService.send({
      to: email,
      subject: 'Activa tu cuenta - Integral Services',
      body,
      channel: 'email',
    });
    logger.info('Activation email sent', { email });
  } catch (err) {
    logger.error('Failed to send activation email', { email, err });
    throw err;
  }
}

export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const body = `Tu código de verificación es: ${code}\n\nVálido por 10 minutos. No lo compartas.`;
  try {
    await notificationsService.send({
      to: email,
      subject: 'Código de verificación - Integral Services',
      body,
      channel: 'email',
    });
    logger.info('OTP email sent', { email });
  } catch (err) {
    logger.error('Failed to send OTP email', { email, err });
    throw err;
  }
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const link = `${FRONTEND_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const body = `Para restablecer tu contraseña haz clic en:\n\n${link}\n\nSi no solicitaste esto, ignora el correo.`;
  try {
    await notificationsService.send({
      to: email,
      subject: 'Restablecer contraseña - Integral Services',
      body,
      channel: 'email',
    });
    logger.info('Password reset email sent', { email });
  } catch (err) {
    logger.error('Failed to send password reset email', { email, err });
    throw err;
  }
}
