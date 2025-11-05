import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { PrivateAxios } from "@/services/PrivateAxios";
import { PublicAxios } from "@/services/PublicAxios";
import { postLogin } from "@/services/api/AuthAPI";
import type { AxiosError } from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const logout = useCallback(async () => {
    try {
      await PublicAxios.get("/auth/common/sign-out");
    } catch {
    } finally {
      setIsAuthenticated(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await PrivateAxios.get("/admin/management/me");
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        try {
          await PublicAxios.get("/auth/common/refresh");
          await PrivateAxios.get("/admin/management/me");
          setIsAuthenticated(true);
        } catch {
          await logout();
        }
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await postLogin({ email, password });
      if (res.pass) {
        setIsAuthenticated(true);
      } else {
        throw new Error(res.data as string);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const responseInterceptor = PrivateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
          const originalRequest = axiosError.config;

          if (originalRequest?.url?.includes("/auth/common/refresh")) {
            await logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      PrivateAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, isInitialized, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
