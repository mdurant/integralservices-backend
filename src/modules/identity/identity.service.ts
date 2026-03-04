import { LoginDto, RegisterDto, TokenResponseDto } from './dtos';
import { HttpError } from '../../shared/errors/httpError';

export class IdentityService {
  async login(_data: LoginDto): Promise<TokenResponseDto> {
    // TODO: validar credenciales, generar JWT
    throw HttpError.notFound('IdentityService.login not implemented');
  }

  async register(_data: RegisterDto): Promise<TokenResponseDto> {
    // TODO: crear usuario, generar JWT
    throw HttpError.notFound('IdentityService.register not implemented');
  }

  async refreshToken(_refreshToken: string): Promise<{ accessToken: string; expiresIn: string }> {
    // TODO: validar refresh token, emitir nuevo access token
    throw HttpError.notFound('IdentityService.refreshToken not implemented');
  }
}

export const identityService = new IdentityService();
