import { Request, Response } from 'express';
import { identityService } from './identity.service';
import { AuthenticatedRequest } from '../../shared/security/authMiddleware';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ActivateEmailDto,
  SendOtpDto,
  VerifyOtpDto,
  UpdateProfileDto,
  DeactivateAccountDto,
  VerifyContactChangeDto,
} from './dtos';

export class IdentityController {
  async register(req: Request, res: Response): Promise<void> {
    const data = req.body as RegisterDto;
    const result = await identityService.register(data);
    res.status(201).json(result);
  }

  async activateEmail(req: Request, res: Response): Promise<void> {
    const data = req.body as ActivateEmailDto;
    const result = await identityService.activateEmail(data);
    res.json(result);
  }

  async sendOtp(req: Request, res: Response): Promise<void> {
    const data = req.body as SendOtpDto;
    const result = await identityService.sendOtp(data);
    res.json(result);
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    const data = req.body as VerifyOtpDto;
    const ip = req.ip ?? (req as any).socket?.remoteAddress;
    const userAgent = req.get('user-agent');
    const result = await identityService.verifyOtp(data, ip, userAgent);
    res.json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginDto;
    const result = await identityService.login(data);
    res.json(result);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };
    const result = await identityService.refreshToken(refreshToken);
    res.json(result);
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const data = req.body as ForgotPasswordDto;
    const result = await identityService.forgotPassword(data);
    res.json(result);
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const data = req.body as ResetPasswordDto;
    const result = await identityService.resetPassword(data);
    res.json(result);
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const result = await identityService.getProfile(userId);
    res.json(result);
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const data = req.body as UpdateProfileDto;
    const result = await identityService.updateProfile(userId, data);
    res.json(result);
  }

  async verifyContactChange(req: Request, res: Response): Promise<void> {
    const data = req.body as VerifyContactChangeDto;
    const result = await identityService.verifyContactChange(data);
    res.json(result);
  }

  async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const ip = req.ip ?? req.socket?.remoteAddress;
    const userAgent = req.get('user-agent');
    const result = await identityService.getDashboard(userId, ip, userAgent);
    res.json(result);
  }

  async deactivateAccount(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const data = req.body as DeactivateAccountDto;
    const result = await identityService.deactivateAccount(userId, data);
    res.json(result);
  }

  async uploadProfileImage(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const file = (req as Request & { file?: { filename: string } }).file;
    if (!file?.filename) {
      res.status(400).json({ error: { message: 'No se subió ninguna imagen', code: 'MISSING_FILE' } });
      return;
    }
    const result = await identityService.setProfileImageUrl(userId, `/uploads/${file.filename}`);
    res.json(result);
  }
}

export const identityController = new IdentityController();
