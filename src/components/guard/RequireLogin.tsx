import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const RequireLogin = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default RequireLogin;
