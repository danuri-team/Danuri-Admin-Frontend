import { PublicAxios } from "../PublicAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse } from "@/types/api";
import type {
  LoginRequest,
  SignupRequest,
  UpdatePasswordRequest,
  SendPasswordCodeRequest,
  ResetPasswordTokenRequest,
} from "@/types/domains/auth";

class AuthAPIService extends BaseAPI {
  async postLogin(data: LoginRequest): Promise<ApiResponse<unknown>> {
    return this.post("/auth/admin/sign-in", data);
  }

  async postSignup(data: SignupRequest): Promise<ApiResponse<unknown>> {
    return this.post("/auth/admin/sign-up", data);
  }

  async updateAdminPassword(data: UpdatePasswordRequest): Promise<ApiResponse<unknown>> {
    return this.put("/admin/management/password", data);
  }

  async postSendPasswordCode(data: SendPasswordCodeRequest): Promise<ApiResponse<unknown>> {
    return this.post("/auth/admin/find-password", data);
  }

  async postPasswordResetToken(data: ResetPasswordTokenRequest): Promise<ApiResponse<unknown>> {
    const { phone, code } = data;
    return this.post("/auth/admin/reset-token", {
      phone,
      auth_code: code,
    });
  }
}

export const AuthAPI = new AuthAPIService(PublicAxios);

export const postLogin = (data: LoginRequest) => AuthAPI.postLogin(data);
export const postSignup = (data: SignupRequest) => AuthAPI.postSignup(data);
export const updateAdminPassword = (data: UpdatePasswordRequest) =>
  AuthAPI.updateAdminPassword(data);
export const postSendPasswordCode = (data: SendPasswordCodeRequest) =>
  AuthAPI.postSendPasswordCode(data);
export const postPasswordResetToken = (data: ResetPasswordTokenRequest) =>
  AuthAPI.postPasswordResetToken(data);
