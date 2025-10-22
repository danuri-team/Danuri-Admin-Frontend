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
