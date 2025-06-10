import { Navigate, Route, Routes } from "react-router-dom";
import UsagePage from "./pages/UsagePage";
import InfoManagementPage from "./pages/InfoManagementPage";
import ItemManagementPage from "./pages/ItemManagementPage";
import UserManagementPage from "./pages/UserManagementPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={'/auth/login'} replace/>} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/usage" element={<UsagePage />} />
      <Route path="/info" element={<InfoManagementPage />} />
      <Route path="/item" element={<ItemManagementPage />} />
      <Route path="/user" element={<UserManagementPage />} />
    </Routes>
  );
}

export default App;
