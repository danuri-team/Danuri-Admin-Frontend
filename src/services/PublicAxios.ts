import axios from "axios";

export const PublicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_SERVER,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
