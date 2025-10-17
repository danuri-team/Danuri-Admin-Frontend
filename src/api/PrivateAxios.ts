import axios from "axios";

export const PrivateAxios = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_SERVER,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

PrivateAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes("/auth/login")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
