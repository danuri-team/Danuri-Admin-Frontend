import { Navigate, Route, Routes } from "react-router-dom";
import UsagePage from "./pages/UsagePage";
import InfoManagementPage from "./pages/InfoManagementPage";
import ItemManagementPage from "./pages/ItemManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SpaceManagementPage from "./pages/SpaceManagementPage";
import RentalManagementPage from "./pages/RentalManagementPage";
import RequireLogin from "./components/RequireLogin";
import GuestGuard from "./components/GuestGuard";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/auth/login"} replace />} />
      <Route element={<GuestGuard />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
      </Route>

      <Route element={<RequireLogin />}>
        <Route path="/usage" element={<UsagePage />} />
        <Route path="/info" element={<InfoManagementPage />} />
        <Route path="/item" element={<ItemManagementPage />} />
        <Route path="/user" element={<UserManagementPage />} />
        <Route path="/rental" element={<RentalManagementPage />} />
        <Route path="/space" element={<SpaceManagementPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
