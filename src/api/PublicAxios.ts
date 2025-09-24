import axios from "axios";

//토큰 필요 X
export const PublicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_SERVER,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
