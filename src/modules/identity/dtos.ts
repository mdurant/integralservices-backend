export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  tenantId?: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name?: string;
    tenantId?: string;
  };
}
