export interface Usage {
  id: string;
  user_id: string;
  space_id: string;
  start_at: string;
  end_at: string | null;
  form_result: string;
  [key: string]: unknown;
}

export interface UsageSearchType {
  startDate: string | null;
  endDate: string | null;
  spaceId: string | null;
  userId: string | null;
}

export interface CreateUsageRequest {
  userId: string | null;
  spaceId: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface UsageSearchRequest {
  usageForm: UsageSearchType;
  page: number;
  size: number;
}

export interface UsageIdRequest {
  usageId: string;
}

export interface ForcedLeaveRequest {
  usageId: string;
  end_at: string;
}

export interface ExportUsageRequest {
  startDate: string | null;
  endDate: string | null;
  spaceId: string | null;
  userId: string | null;
}

export interface ExportMonthUsageRequest {
  spaceId: string;
  year: string;
  month: string;
}
