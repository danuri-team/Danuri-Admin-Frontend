import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Navigate, Outlet } from "react-router-dom";

const GuestGuard = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const accessToken = authState.access_token;

    return accessToken ? <Navigate to={'/usage'}/> : <Outlet />

}

export default GuestGuard