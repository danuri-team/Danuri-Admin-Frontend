import type { AxiosError } from "axios";

export class ApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code?: string,
    status?: number,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromAxiosError(error: AxiosError): ApiError {
    const message = (error.response?.data as any)?.message || error.message || "알 수 없는 오류가 발생했습니다.";
    const code = error.code;
    const status = error.response?.status;
    const details = error.response?.data;

    return new ApiError(message, code, status, details);
  }

  static fromError(error: Error): ApiError {
    return new ApiError(error.message);
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return ApiError.fromError(error);
    }

    if (typeof error === "string") {
      return new ApiError(error);
    }

    return new ApiError("알 수 없는 오류가 발생했습니다.");
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      details: this.details,
    };
  }
}
