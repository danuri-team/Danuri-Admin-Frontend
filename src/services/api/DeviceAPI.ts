import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  Device,
  CreateDeviceRequest,
  UpdateDeviceRequest,
  DeviceIdRequest,
  DeviceQRResponse,
} from "@/types/domains/device";

class DeviceAPIService extends BaseAPI {
  async postAddDevice(data: CreateDeviceRequest): Promise<ApiResponse<Device>> {
    return this.post<Device>("/admin/devices", data);
  }

  async putUpdateDevice(data: UpdateDeviceRequest): Promise<ApiResponse<Device>> {
    const { deviceId, name } = data;
    return this.put<Device>(`/admin/devices/${deviceId}`, { name });
  }

  async deleteDevice({ deviceId }: DeviceIdRequest): Promise<ApiResponse<void>> {
    return this.delete<void>(`/admin/devices/${deviceId}`);
  }

  async getSearchDevice({ deviceId }: DeviceIdRequest): Promise<ApiResponse<Device>> {
    return this.get<Device>(`/admin/devices/${deviceId}`);
  }

  async getSearchCompanyDevice(
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Device>>> {
    return this.get<PaginatedResponse<Device>>("/admin/devices", { params });
  }

  async getDeviceQR({ deviceId }: DeviceIdRequest): Promise<ApiResponse<DeviceQRResponse>> {
    return this.get<DeviceQRResponse>(`/admin/devices/${deviceId}/sign-in`);
  }
}

export const DeviceAPI = new DeviceAPIService(PrivateAxios);

export const postAddDevice = (data: CreateDeviceRequest) => DeviceAPI.postAddDevice(data);
export const putUpdateDevice = (data: UpdateDeviceRequest) => DeviceAPI.putUpdateDevice(data);
export const deleteDevice = (params: DeviceIdRequest) => DeviceAPI.deleteDevice(params);
export const getSearchDevice = (params: DeviceIdRequest) => DeviceAPI.getSearchDevice(params);
export const getSearchCompanyDevice = (params: PaginationParams) =>
  DeviceAPI.getSearchCompanyDevice(params);
export const getDeviceQR = (params: DeviceIdRequest) => DeviceAPI.getDeviceQR(params);
