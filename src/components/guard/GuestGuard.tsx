import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return isAuthenticated ? <Navigate to={"/usage"} /> : <Outlet />;
};

export default GuestGuard;
