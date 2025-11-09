export interface ApiResponse<T = unknown> {
  data: T;
  pass: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  total_pages: number;
}
