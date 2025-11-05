import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { LoginPage, SignupPage, FindPassword } from "./pages/auth";
import {
  UsagePage,
  InfoPage,
  ItemPage,
  UserPage,
  RentalPage,
  SpacePage,
  MachinePage,
  JoinFormPage,
} from "./pages/management";
import NotFoundPage from "./pages/NotFoundPage";

import RequireLogin from "./components/guard/RequireLogin";
import GuestGuard from "./components/guard/GuestGuard";

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
          <Route path="/info" element={<InfoPage />} />
          <Route path="/item" element={<ItemPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/rental" element={<RentalPage />} />
          <Route path="/space" element={<SpacePage />} />
          <Route path="/machine" element={<MachinePage />} />
          <Route path="/joinForm" element={<JoinFormPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer
        autoClose={1500}
        position="top-right"
        theme="dark"
        hideProgressBar
        toastStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "10px",
          fontSize: "15px",
          minHeight: "50px",
        }}
        closeButton={false}
      />
    </>
  );
}

export default App;
