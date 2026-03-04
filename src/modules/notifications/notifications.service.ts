/**
 * Servicio de notificaciones (email, push, etc.).
 * Usado por otros módulos (ej. quotes, identity) para enviar mensajes.
 */

export interface SendNotificationDto {
  to: string | string[];
  subject?: string;
  body: string;
  channel?: 'email' | 'push' | 'sms';
  template?: string;
  data?: Record<string, unknown>;
}

export class NotificationsService {
  async send(_payload: SendNotificationDto): Promise<{ id: string; sentAt: string }> {
    // TODO: integrar con proveedor (SendGrid, SES, etc.)
    return {
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
    };
  }

  async sendBulk(_payloads: SendNotificationDto[]): Promise<{ sent: number; failed: number }> {
    // TODO: envío masivo
    return { sent: 0, failed: 0 };
  }
}

export const notificationsService = new NotificationsService();
