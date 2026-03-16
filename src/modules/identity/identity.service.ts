import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { Op } from 'sequelize';
import { env } from '../../config/env';
import { HttpError } from '../../shared/errors/httpError';
import { logger } from '../../config/logger';
import { User, OtpCode, UserSession, RegistrationLog, ActivationToken } from '../../models';
import {
  RegisterDto,
  LoginDto,
  TokenResponseDto,
  UserInfoDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ActivateEmailDto,
  SendOtpDto,
  VerifyOtpDto,
  UpdateProfileDto,
  DashboardResponseDto,
  DeactivateAccountDto,
} from './dtos';
import { sendActivationEmail, sendOtpEmail, sendPasswordResetEmail } from './email.service';

const SALT_ROUNDS = 10;
const OTP_LENGTH = 6;
const ACCESS_SECRET = env.JWT_ACCESS_SECRET ?? env.JWT_SECRET;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET ?? env.JWT_SECRET;
const ACCESS_TTL_MIN = env.JWT_ACCESS_TTL_MIN ?? 15;
const REFRESH_TTL_DAYS = env.JWT_REFRESH_TTL_DAYS ?? 15;
const OTP_TTL_MIN = env.OTP_TTL_MIN ?? 10;
const ACTIVATION_TTL_HOURS = env.ACTIVATION_TOKEN_TTL_HOURS ?? 24;

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function toUserInfo(user: User): UserInfoDto {
  const profileCompleted = !!(user.first_name && user.last_name && user.nationality && user.phone && user.sex && user.region_code && user.comuna_code && user.actividad_ofertada_id);
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name ?? undefined,
    lastName: user.last_name ?? undefined,
    profileImageUrl: user.profile_image_url ?? undefined,
    status: user.status,
    twoFaEnabled: user.two_fa_enabled,
    profileCompleted,
  };
}

function generateAccessToken(userId: string, email: string, roles: string[] = ['CLIENT']): string {
  return jwt.sign(
    { sub: userId, email, roles },
    ACCESS_SECRET!,
    { expiresIn: `${ACCESS_TTL_MIN}m` }
  );
}

function generateRefreshToken(): string {
  return randomBytes(32).toString('hex');
}

export class IdentityService {
  async register(data: RegisterDto): Promise<{ message: string; email: string }> {
    if (data.password !== data.rePassword) throw HttpError.badRequest('Las contraseñas no coinciden');
    if (!data.acceptTerms) throw HttpError.badRequest('Debes aceptar los términos y condiciones');
    const existing = await User.findOne({ where: { email: data.email.toLowerCase() } });
    if (existing) throw HttpError.conflict('El correo ya está registrado');

    const password_hash = await hashPassword(data.password);
    const user = await User.create({
      email: data.email.toLowerCase().trim(),
      password_hash,
      first_name: data.nombres.trim(),
      last_name: data.apellidos.trim(),
      status: 'pending_activation',
      terms_accepted_at: new Date(),
    });

    const token = randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + ACTIVATION_TTL_HOURS * 60 * 60 * 1000);
    await ActivationToken.create({ user_id: user.id, token: hashToken(token), expires_at });

    await sendActivationEmail(user.email, token);
    return { message: 'Revisa tu correo para activar la cuenta.', email: user.email };
  }

  async activateEmail(data: ActivateEmailDto): Promise<{ message: string }> {
    const hashed = hashToken(data.token);
    const row = await ActivationToken.findOne({
      where: { token: hashed, used_at: null, expires_at: { [Op.gt]: new Date() } },
    });
    if (!row) throw HttpError.badRequest('Enlace inválido o expirado');

    const user = await User.findByPk(row.user_id);
    if (!user || user.status !== 'pending_activation') throw HttpError.badRequest('Usuario ya activado o inexistente');

    await user.update({ status: 'pending_otp', email_verified_at: new Date() });
    await row.update({ used_at: new Date() });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires_at = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
    await OtpCode.create({ user_id: user.id, code, type: 'activation', expires_at });
    await sendOtpEmail(user.email, code);

    return { message: 'Cuenta activada. Revisa tu correo para el código OTP.' };
  }

  async sendOtp(data: SendOtpDto): Promise<{ message: string }> {
    const user = await User.findOne({ where: { email: data.email.toLowerCase() } });
    if (!user) return { message: 'Si el correo existe, recibirás el código.' };

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires_at = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
    await OtpCode.create({ user_id: user.id, code, type: 'login', expires_at });
    await sendOtpEmail(user.email, code);
    return { message: 'Código enviado al correo.' };
  }

  async verifyOtp(data: VerifyOtpDto, ip?: string, userAgent?: string): Promise<TokenResponseDto> {
    const user = await User.findOne({ where: { email: data.email.toLowerCase() } });
    if (!user) throw HttpError.unauthorized('Credenciales inválidas');

    const otp = await OtpCode.findOne({
      where: { user_id: user.id, code: data.code, type: { [Op.in]: ['activation', 'login'] }, used_at: null, expires_at: { [Op.gt]: new Date() } },
      order: [['created_at', 'DESC']],
    });
    if (!otp) throw HttpError.badRequest('Código OTP inválido o expirado');

    await otp.update({ used_at: new Date() });
    await user.update({ status: 'active', two_fa_enabled: true });
    await RegistrationLog.create({ user_id: user.id, event: 'dashboard_first_access', ip, user_agent: userAgent ?? undefined, created_at: new Date() });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
    await UserSession.create({
      user_id: user.id,
      refresh_token_hash: hashToken(refreshToken),
      remember_me: true,
      expires_at: expiresAt,
    });

    logger.info('User verified OTP and reached dashboard', { userId: user.id, email: user.email });
    return {
      accessToken,
      refreshToken,
      expiresIn: `${ACCESS_TTL_MIN}m`,
      user: toUserInfo(user),
    };
  }

  async login(data: LoginDto): Promise<TokenResponseDto> {
    const user = await User.findOne({ where: { email: data.email.toLowerCase() } });
    if (!user) throw HttpError.unauthorized('Correo o contraseña incorrectos');

    const valid = await comparePassword(data.password, user.password_hash);
    if (!valid) throw HttpError.unauthorized('Correo o contraseña incorrectos');

    if (user.status === 'pending_activation') throw HttpError.badRequest('Debes activar tu cuenta desde el correo.');
    if (user.status === 'pending_otp') throw HttpError.badRequest('Debes ingresar el código OTP enviado a tu correo.');
    if (user.status === 'deactivated') throw HttpError.forbidden('Cuenta desactivada.');

    await user.update({ last_login_at: new Date() });

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + (data.rememberMe ? REFRESH_TTL_DAYS : 1) * 24 * 60 * 60 * 1000);
    await UserSession.create({
      user_id: user.id,
      refresh_token_hash: hashToken(refreshToken),
      remember_me: !!data.rememberMe,
      expires_at: expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: `${ACCESS_TTL_MIN}m`,
      user: toUserInfo(user),
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: string; user: UserInfoDto }> {
    const hash = hashToken(refreshToken);
    const session = await UserSession.findOne({
      where: { refresh_token_hash: hash, revoked_at: null, expires_at: { [Op.gt]: new Date() } },
    });
    if (!session) throw HttpError.unauthorized('Refresh token inválido o expirado');

    const user = await User.findByPk(session.user_id);
    if (!user || user.status !== 'active') throw HttpError.unauthorized('Usuario no disponible');

    const accessToken = generateAccessToken(user.id, user.email);
    return { accessToken, expiresIn: `${ACCESS_TTL_MIN}m`, user: toUserInfo(user) };
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await User.findOne({ where: { email: data.email.toLowerCase() } });
    if (!user) return { message: 'Si el correo existe, recibirás un enlace para restablecer la contraseña.' };

    const token = randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000);
    await ActivationToken.create({ user_id: user.id, token: hashToken(token), expires_at });
    await sendPasswordResetEmail(user.email, token);
    return { message: 'Revisa tu correo para restablecer la contraseña.' };
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    if (data.newPassword !== data.rePassword) throw HttpError.badRequest('Las contraseñas no coinciden');
    const hashed = hashToken(data.token);
    const row = await ActivationToken.findOne({ where: { token: hashed, used_at: null, expires_at: { [Op.gt]: new Date() } } });
    if (!row) throw HttpError.badRequest('Enlace inválido o expirado');

    const user = await User.findByPk(row.user_id);
    if (!user) throw HttpError.notFound('Usuario no encontrado');

    user.password_hash = await hashPassword(data.newPassword);
    await user.save();
    await row.update({ used_at: new Date() });

    // Seguridad: invalidar todas las sesiones de refresco para que el restablecimiento
    // cierre cualquier sesión potencialmente comprometida
    await UserSession.update(
      { revoked_at: new Date() },
      { where: { user_id: user.id } }
    );

    return { message: 'Contraseña actualizada. Inicia sesión.' };
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<UserInfoDto> {
    const user = await User.findByPk(userId);
    if (!user) throw HttpError.notFound('Usuario no encontrado');
    if (user.status === 'deactivated') throw HttpError.forbidden('Cuenta desactivada.');

    if (data.phone !== undefined) {
      const digits = data.phone.replace(/\D/g, '');
      if (digits.length !== 8) throw HttpError.badRequest('El teléfono debe tener 8 dígitos');
      data.phone = digits;
    }

    await user.update({
      first_name: data.nombres ?? user.first_name,
      last_name: data.apellidos ?? user.last_name,
      nationality: data.nacionalidad ?? user.nationality,
      phone: data.phone ?? user.phone,
      sex: data.sexo ?? user.sex,
      region_code: data.regionCode ?? user.region_code,
      comuna_code: data.comunaCode ?? user.comuna_code,
      actividad_ofertada_id: data.actividadOfertadaId ?? user.actividad_ofertada_id,
    });
    return toUserInfo(user);
  }

  async deactivateAccount(userId: string, data: DeactivateAccountDto): Promise<{ message: string }> {
    const user = await User.findByPk(userId);
    if (!user) throw HttpError.notFound('Usuario no encontrado');
    const valid = await comparePassword(data.password, user.password_hash);
    if (!valid) throw HttpError.unauthorized('Contraseña incorrecta');
    await user.update({ status: 'deactivated' });
    await UserSession.update({ revoked_at: new Date() }, { where: { user_id: userId } });
    return { message: 'Cuenta desactivada.' };
  }

  async getProfile(userId: string): Promise<UserInfoDto & { nationality?: string; phone?: string; sex?: string; regionCode?: string; comunaCode?: string; actividadOfertadaId?: string }> {
    const user = await User.findByPk(userId);
    if (!user) throw HttpError.notFound('Usuario no encontrado');
    return {
      ...toUserInfo(user),
      nationality: user.nationality ?? undefined,
      phone: user.phone ?? undefined,
      sex: user.sex ?? undefined,
      regionCode: user.region_code ?? undefined,
      comunaCode: user.comuna_code ?? undefined,
      actividadOfertadaId: user.actividad_ofertada_id ?? undefined,
    };
  }

  async getDashboard(userId: string, ip?: string, userAgent?: string): Promise<DashboardResponseDto> {
    const user = await User.findByPk(userId);
    if (!user) throw HttpError.notFound('Usuario no encontrado');

    const log = await RegistrationLog.findOne({ where: { user_id: userId, event: 'dashboard_first_access' }, order: [['created_at', 'DESC']] });
    const firstName = user.first_name ?? 'Usuario';
    return {
      welcome: `Bienvenido, ${firstName}. Tu cuenta ha sido verificada correctamente.`,
      user: toUserInfo(user),
      registrationLog: log ? { event: log.event, createdAt: log.created_at.toISOString() } : { event: 'dashboard_first_access', createdAt: new Date().toISOString() },
    };
  }

  async setProfileImageUrl(userId: string, url: string): Promise<UserInfoDto> {
    const user = await User.findByPk(userId);
    if (!user) throw HttpError.notFound('Usuario no encontrado');
    await user.update({ profile_image_url: url });
    return toUserInfo(user);
  }
}

export const identityService = new IdentityService();
