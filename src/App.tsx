import { Navigate, Route, Routes } from "react-router-dom";
import UsagePage from "./pages/UsagePage";
import InfoManagementPage from "./pages/InfoManagementPage";
import ItemManagementPage from "./pages/ItemManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SpaceManagementPage from "./pages/SpaceManagementPage";
import RentalManagementPage from "./pages/RentalManagementPage";
import CampaignManagementPage from "./pages/CampaignManagementPage";
import NotiTalkManagementPage from "./pages/NotiTalkManagementPage";
import RequireLogin from "./components/guard/RequireLogin";
import GuestGuard from "./components/guard/GuestGuard";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from 'react-toastify'
import FindPassword from "./pages/FindPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/auth/login"} replace />} />

        <Route element={<GuestGuard />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/auth/password" element={<FindPassword />} />
        </Route>

        <Route element={<RequireLogin />}>
          <Route path="/usage" element={<UsagePage />} />
          <Route path="/info" element={<InfoManagementPage />} />
          <Route path="/item" element={<ItemManagementPage />} />
          <Route path="/user" element={<UserManagementPage />} />
          <Route path="/rental" element={<RentalManagementPage />} />
          <Route path="/space" element={<SpaceManagementPage />} />
          <Route path="/campaign" element={<CampaignManagementPage />} />
          <Route path="/talk" element={<NotiTalkManagementPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        autoClose={1500}
        position="top-right"
        theme="dark"
        hideProgressBar
        toastStyle={{backgroundColor: 'rgb(0, 0, 0, 0.6)', borderRadius: '10px', fontSize: '15px', minHeight: '50px'}}
        closeButton={false}
      />
    </>

  );
}

export default App;
