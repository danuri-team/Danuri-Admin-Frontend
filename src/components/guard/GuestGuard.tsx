// 로그인 되어있지 않는 사용자만 접근
// ex) 로그인, 회원가입 페이지

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const isAuthenticated = authState.isAuthenticated;
  const isInitialized = authState.isInitialized;

  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return isAuthenticated ? <Navigate to={"/usage"} /> : <Outlet />;
};

export default GuestGuard;
