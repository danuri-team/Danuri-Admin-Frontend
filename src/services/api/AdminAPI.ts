import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type { Admin, UpdateAdminRequest, AdminIdRequest } from "@/types/domains/admin";

class AdminAPIService extends BaseAPI {
  async getMyInfo(): Promise<ApiResponse<Admin>> {
    return this.get<Admin>("/admin/management/me");
  }

  async getAdminInfo({ adminId }: AdminIdRequest): Promise<ApiResponse<Admin>> {
    return this.get<Admin>(`/admin/management/${adminId}`);
  }

  async getAllAdminInfo(params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Admin>>> {
    return this.get<PaginatedResponse<Admin>>("/admin/management", { params });
  }

  async putAdminInfo(data: UpdateAdminRequest): Promise<ApiResponse<Admin>> {
    return this.put<Admin>("/admin/management", data);
  }

  async deleteAdmin({ adminId }: AdminIdRequest): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/management/${adminId}`);
  }
}

export const AdminAPI = new AdminAPIService(PrivateAxios);

export const getMyInfo = () => AdminAPI.getMyInfo();
export const getAdminInfo = (params: AdminIdRequest) => AdminAPI.getAdminInfo(params);
export const getAllAdminInfo = (params: PaginationParams) => AdminAPI.getAllAdminInfo(params);
export const putAdminInfo = (data: UpdateAdminRequest) => AdminAPI.putAdminInfo(data);
export const deleteAdmin = (params: AdminIdRequest) => AdminAPI.deleteAdmin(params);
