import nodemailer from 'nodemailer';
import { env } from './env';
import { logger } from './logger';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn('SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Emails will not be sent.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}): Promise<{ id: string; sentAt: string }> {
  const transport = getTransporter();
  if (!transport) {
    logger.debug('Mail skipped (no SMTP):', { to: options.to, subject: options.subject });
    return { id: `no-smtp-${Date.now()}`, sentAt: new Date().toISOString() };
  }
  const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
  const info = await transport.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, '<br>'),
  });
  logger.info('Email sent', { messageId: info.messageId, to });
  return {
    id: info.messageId ?? `sent-${Date.now()}`,
    sentAt: new Date().toISOString(),
  };
}
