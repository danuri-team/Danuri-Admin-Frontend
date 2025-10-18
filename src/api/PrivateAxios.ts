import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { PublicAxios } from "./PublicAxios";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const PrivateAxios = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_SERVER,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

PrivateAxios.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as RetryAxiosRequestConfig | undefined;

    if (!originalRequest || originalRequest.url?.includes("/auth/common/refresh")) {
      return Promise.reject(error);
    }

    if ((axiosError.response?.status === 500 || 401) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return PrivateAxios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 쿠키의 refresh token으로 토큰 재발급
        await PublicAxios.get("/auth/common/refresh");

        processQueue(null);
        isRefreshing = false;

        // 원래 요청 재시도
        return PrivateAxios(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급 실패 시 로그인 페이지로
        processQueue(refreshError);
        isRefreshing = false;

        PublicAxios.get("/auth/common/sign-out");

        if (!window.location.pathname.includes("/auth/login")) {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
