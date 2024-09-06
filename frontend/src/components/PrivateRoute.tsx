import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../hooks/auth";

export const PrivateRoute = () => {
    const { isAuth } = useAuthStore();
    return (
        isAuth ? <Outlet /> : <Navigate to='/login' />
    );
};

export const AdminPrivateRoute = () => {
    const { isAuth } = useAuthStore();

    const token: string = useAuthStore.getState().access;
    if (!token) {
        console.error("Error decoding token");
    }
    return (
        isAuth ? <Outlet /> : <Navigate to='/login' />
    );
};
