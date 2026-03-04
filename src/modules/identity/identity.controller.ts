import { Request, Response } from 'express';
import { identityService } from './identity.service';
import { LoginDto, RegisterDto } from './dtos';

export class IdentityController {
  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as LoginDto;
    const result = await identityService.login(data);
    res.json(result);
  }

  async register(req: Request, res: Response): Promise<void> {
    const data = req.body as RegisterDto;
    const result = await identityService.register(data);
    res.status(201).json(result);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body as { refreshToken: string };
    const result = await identityService.refreshToken(refreshToken);
    res.json(result);
  }
}

export const identityController = new IdentityController();
