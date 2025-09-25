import axios from "axios";

//토큰 필요 X
export const PublicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
