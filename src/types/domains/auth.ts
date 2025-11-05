export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  companyId: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
}

export interface UpdatePasswordRequest {
  new_password: string;
  confirm_password: string;
}

export interface SendPasswordCodeRequest {
  phone: string;
}

export interface ResetPasswordTokenRequest {
  phone: string;
  code: string;
}
