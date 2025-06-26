import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const RequireLogin = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const accessToken = authState.access_token;
  const isLoading = authState.isLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return accessToken ? <Outlet /> : <Navigate to={"auth/login"} replace />;
};

export default RequireLogin;
