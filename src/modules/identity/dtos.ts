// ----- Register -----
export interface RegisterDto {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  rePassword: string;
  acceptTerms: boolean;
}

/** Pre-registro de técnico: solo nombres, apellidos, email, password. */
export interface TechnicianRegisterDto {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  rePassword?: string;
  acceptTerms?: boolean;
}

// ----- Login -----
export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ----- Recovery -----
export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
  rePassword: string;
}

// ----- Activation -----
export interface ActivateEmailDto {
  token: string;
}

// ----- OTP -----
export interface SendOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  code: string;
}

// ----- 2FA -----
export interface Enable2FaDto {
  email: string;
  otpCode: string;
}

// ----- Tokens -----
export interface TokenResponseDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn: string;
  user: UserInfoDto;
}

export interface UserInfoDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  status?: string;
  twoFaEnabled?: boolean;
  profileCompleted?: boolean;
}

// ----- Profile -----
export interface UpdateProfileDto {
  nombres?: string;
  apellidos?: string;
  email?: string;
  nacionalidad?: string;
  phone?: string;
  sexo?: 'M' | 'F' | 'X' | 'other';
  regionCode?: string;
  comunaCode?: string;
  actividadOfertadaId?: string;
}

export interface VerifyContactChangeDto {
  kind: 'email' | 'phone';
  newValue: string;
  code: string;
}

export interface ProfileResponseDto extends UserInfoDto {
  lastName?: string;
  nationality?: string;
  phone?: string;
  sex?: string;
  regionCode?: string;
  comunaCode?: string;
  actividadOfertadaId?: string;
  emailVerifiedAt?: string;
  twoFaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ----- Dashboard -----
export interface DashboardResponseDto {
  welcome: string;
  user: UserInfoDto;
  registrationLog: { event: string; createdAt: string };
}

// ----- Deactivate -----
export interface DeactivateAccountDto {
  password: string;
}
