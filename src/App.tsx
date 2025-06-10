import { Route, Routes } from "react-router-dom";
import UsagePage from "./pages/UsagePage";
import InfoManagementPage from "./pages/InfoManagementPage";
import ItemManagementPage from "./pages/ItemManagementPage";
import UserManagementPage from "./pages/UserManagementPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UsagePage />} />
      <Route path="/info" element={<InfoManagementPage />} />
      <Route path="/item" element={<ItemManagementPage />} />
      <Route path="/user" element={<UserManagementPage />} />
    </Routes>
  );
}

export default App;
