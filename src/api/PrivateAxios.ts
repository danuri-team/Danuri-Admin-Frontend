import axios from "axios";
import { store } from "../redux/store";
import { clearToken, refreshAccessToken } from "../redux/reducers/authSlice";

//토큰 필요 O
export const PrivateAxios = axios.create({
  baseURL: import.meta.env.VITE_API_DEV_SERVER,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

PrivateAxios.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    let accessToken = state.auth.access_token;
    let refreshToken = state.auth.refresh_token;

    const now = Date.now();

    if (accessToken) {
      if (now > accessToken.expired_at) {
        try {
          const res = await store.dispatch(
            refreshAccessToken({ refreshToken: refreshToken?.token as string })
          );
          if (res.meta.requestStatus === "fulfilled") {
            //리프레시 토큰이 유효
            const newState = store.getState();
            accessToken = newState.auth.access_token;
            refreshToken = newState.auth.refresh_token;
          } else {
            //리프레시 토큰 또한 만료
            store.dispatch(clearToken());
            return Promise.reject(new Error("로그인 세션이 만료되었습니다"));
          }
        } catch (error) {
          store.dispatch(clearToken());
          return Promise.reject(error);
        }
      }
      config.headers.Authorization = `Bearer ${accessToken?.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
