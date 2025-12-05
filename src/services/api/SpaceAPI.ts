import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  Space,
  CreateSpaceRequest,
  UpdateSpaceRequest,
  SpaceIdRequest,
} from "@/types/domains/space";

class SpaceAPIService extends BaseAPI {
  async postCreateSpace(data: CreateSpaceRequest): Promise<ApiResponse<Space>> {
    const { name, startTime, endTime, allowOverlap, allowMultiSpaceBooking } = data;
    return this.post<Space>("/admin/spaces", {
      name,
      start_at: startTime,
      end_at: endTime,
      allow_overlap: allowOverlap,
      allow_multi_space_booking: allowMultiSpaceBooking,
    });
  }

  async putUpdateSpace(data: UpdateSpaceRequest): Promise<ApiResponse<Space>> {
    const { spaceId, name, startTime, endTime, allowOverlap } = data;
    return this.put<Space>(`/admin/spaces/${spaceId}`, {
      name,
      start_at: startTime,
      end_at: endTime,
      allowOverlap,
    });
  }

  async deleteSpace({ spaceId }: SpaceIdRequest): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/spaces/${spaceId}`);
  }

  async getSearchSpace({ spaceId }: SpaceIdRequest): Promise<ApiResponse<Space>> {
    return this.get<Space>(`/admin/spaces/${spaceId}`);
  }

  async getSearchCompanySpace(
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Space>>> {
    return this.get<PaginatedResponse<Space>>("/admin/spaces", { params });
  }
}

export const SpaceAPI = new SpaceAPIService(PrivateAxios);

export const postCreateSpace = (data: CreateSpaceRequest) => SpaceAPI.postCreateSpace(data);
export const putUpdateSpace = (data: UpdateSpaceRequest) => SpaceAPI.putUpdateSpace(data);
export const deleteSpace = (params: SpaceIdRequest) => SpaceAPI.deleteSpace(params);
export const getSearchSpace = (params: SpaceIdRequest) => SpaceAPI.getSearchSpace(params);
export const getSearchCompanySpace = (params: PaginationParams) =>
  SpaceAPI.getSearchCompanySpace(params);
