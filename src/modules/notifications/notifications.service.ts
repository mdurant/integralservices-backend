/**
 * Servicio de notificaciones (email vía SMTP/Mailtrap en dev, push, etc.).
 */

import { sendMail } from '../../config/mail';
import { logger } from '../../config/logger';

export interface SendNotificationDto {
  to: string | string[];
  subject?: string;
  body: string;
  channel?: 'email' | 'push' | 'sms';
  template?: string;
  data?: Record<string, unknown>;
}

export class NotificationsService {
  async send(payload: SendNotificationDto): Promise<{ id: string; sentAt: string }> {
    if (payload.channel === 'email' || !payload.channel) {
      return sendMail({
        to: payload.to,
        subject: payload.subject ?? 'Notificación',
        text: payload.body,
      });
    }
    logger.warn('Channel not implemented', { channel: payload.channel });
    return {
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
  }

  async sendBulk(payloads: SendNotificationDto[]): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;
    for (const p of payloads) {
      try {
        await this.send(p);
        sent++;
      } catch {
        failed++;
      }
    }
    return { sent, failed };
  }
}

export const notificationsService = new NotificationsService();
