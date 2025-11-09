import type { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import type { ApiResponse, ApiError } from "@/types/api";
import { ApiError as ApiErrorClass } from "@/utils/errors/ApiError";

export abstract class BaseAPI {
  protected readonly axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axios.get<T>(url, config);
      return { data: res.data, pass: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axios.post<T>(url, data, config);
      return { data: res.data, pass: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axios.put<T>(url, data, config);
      return { data: res.data, pass: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const res = await this.axios.delete<T>(url, config);
      return { data: res.data, pass: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected handleError(error: unknown): ApiResponse<never> {
    const apiError = this.isAxiosError(error)
      ? ApiErrorClass.fromAxiosError(error)
      : ApiErrorClass.fromUnknown(error);

    if (import.meta.env.DEV) {
      console.error("[API Error]", apiError.toJSON());
    }

    const apiErrorData: ApiError = {
      message: apiError.message,
      code: apiError.code,
      status: apiError.status,
      details: apiError.details,
    };

    return { data: apiErrorData as never, pass: false };
  }

  protected buildQueryParams(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError === true;
  }
}
