import { PrivateAxios } from "../PrivateAxios";
import { BaseAPI } from "./BaseAPI";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  Usage,
  UsageSearchType,
  UsageSearchRequest,
  UsageIdRequest,
  ForcedLeaveRequest,
  ExportUsageRequest,
  ExportMonthUsageRequest,
} from "@/types/domains/usage";
import { downloadBlob, generateFilename } from "@/utils/file/downloadFile";

const normalizeValue = (value: string | null): string | null => {
  return value === "" ? null : value;
};

class UsageAPIService extends BaseAPI {
  async postCreateUsage(usageForm: UsageSearchType): Promise<ApiResponse<Usage>> {
    return this.post<Usage>("/admin/usage", {
      user_id: normalizeValue(usageForm.userId),
      space_id: normalizeValue(usageForm.spaceId),
      start_at: usageForm.startDate,
      end_at: usageForm.endDate,
    });
  }

  async postUsageSearch({
    usageForm,
    page,
    size,
  }: UsageSearchRequest): Promise<ApiResponse<PaginatedResponse<Usage>>> {
    return this.post(
      `/admin/usage/search`,
      {
        user_id: normalizeValue(usageForm.userId),
        space_id: normalizeValue(usageForm.spaceId),
        start_date: usageForm.startDate || null,
        end_date: usageForm.endDate || null,
      },
      { params: { page, size } }
    );
  }

  async getUsageDetail({ usageId }: UsageIdRequest): Promise<ApiResponse<Usage>> {
    return this.get<Usage>(`/admin/usage/${usageId}`);
  }

  async postUsageExcel({
    startDate,
    endDate,
    spaceId,
    userId,
  }: ExportUsageRequest): Promise<ApiResponse<null>> {
    try {
      const res = await this.axios.post(
        "/admin/usage/export",
        {
          start_date: startDate || null,
          end_date: endDate || null,
          space_id: normalizeValue(spaceId),
          user_id: normalizeValue(userId),
        },
        {
          responseType: "blob",
        }
      );

      const filename = generateFilename(
        "이용내역",
        startDate ? new Date(startDate) : new Date(),
        "xlsx"
      );
      downloadBlob(res.data, filename);

      return { data: null, pass: true };
    } catch {
      return { data: null, pass: false };
    }
  }

  async getMonthUsage({
    usageId,
    year,
    month,
  }: ExportMonthUsageRequest): Promise<ApiResponse<null>> {
    try {
      const res = await this.axios.get(
        `/admin/usage/${usageId}/monthly-usage-excel?year=${year}&month=${month}`
      );
      console.log(res.data);
      return { data: null, pass: true };
    } catch {
      return { data: null, pass: false };
    }
  }

  async putForcedToLeave({ usageId, end_at }: ForcedLeaveRequest): Promise<ApiResponse<Usage>> {
    return this.put<Usage>(`/admin/usage/${usageId}`, { end_at });
  }
}

export const UsageAPI = new UsageAPIService(PrivateAxios);

export const postCreateUsage = (usageForm: UsageSearchType) => UsageAPI.postCreateUsage(usageForm);
export const postUsageSearch = (data: UsageSearchRequest) => UsageAPI.postUsageSearch(data);
export const getUsageDetail = (params: UsageIdRequest) => UsageAPI.getUsageDetail(params);
export const postUsageExcel = (data: ExportUsageRequest) => UsageAPI.postUsageExcel(data);
export const getMonthUsage = (params: ExportMonthUsageRequest) => UsageAPI.getMonthUsage(params);
export const putForcedToLeave = (data: ForcedLeaveRequest) => UsageAPI.putForcedToLeave(data);

export type { UsageSearchType };
