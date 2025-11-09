import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginationParams } from "@/types/api";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserIdRequest,
  UserListResponse,
} from "@/types/domains/user";

class UserAPIService extends BaseAPI {
  async postCreateUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.post<User>("/admin/users", data);
  }

  async putUpdateUser(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    const { userId, phone } = data;
    return this.put<User>(`/admin/users/${userId}`, { phone });
  }

  async deleteUser({ userId }: UserIdRequest): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/users/${userId}`);
  }

  async getSearchUser({ userId }: UserIdRequest): Promise<ApiResponse<User>> {
    return this.get<User>(`/admin/users/${userId}`);
  }

  async getSearchCompanyUser(params: PaginationParams): Promise<ApiResponse<UserListResponse>> {
    return this.get<UserListResponse>("/admin/users", { params });
  }
}

export const UserAPI = new UserAPIService(PrivateAxios);

export const postCreateUser = (data: CreateUserRequest) => UserAPI.postCreateUser(data);
export const putUpdateUser = (data: UpdateUserRequest) => UserAPI.putUpdateUser(data);
export const deleteUser = (params: UserIdRequest) => UserAPI.deleteUser(params);
export const getSearchUser = (params: UserIdRequest) => UserAPI.getSearchUser(params);
export const getSearchCompanyUser = (params: PaginationParams) =>
  UserAPI.getSearchCompanyUser(params);
