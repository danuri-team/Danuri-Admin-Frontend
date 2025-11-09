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

    const status = axiosError.response?.status;
    if (typeof status === "number" && [401, 500].includes(status) && !originalRequest._retry) {
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
        await PublicAxios.get("/auth/common/refresh");

        processQueue(null);
        isRefreshing = false;

        return PrivateAxios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
