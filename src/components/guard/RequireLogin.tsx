// 로그인 되어있는 사용자만 접근

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

const RequireLogin = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticated = authState.isAuthenticated;
  const isInitialized = authState.isInitialized;

  // 초기 인증 확인 중
  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default RequireLogin;
