import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../hooks/auth";
import jwt_decode from 'jwt-decode';

export const PrivateRoute = () => {
    const { isAuth } = useAuthStore();
    return (
        isAuth ? <Outlet /> : <Navigate to='/login' />
    );
};

export const AdminPrivateRoute = () => {
    const { isAuth, access: token } = useAuthStore();

    if (!token) {
        console.error("Error: No token found");
        return <Navigate to='/login' />;
    }

    try {
        const tokenDecoded = jwt_decode(token);
        const userRole = tokenDecoded.role;

        // Verifica si el rol es 'admin'
        return isAuth && userRole === 'admin' ? <Outlet /> : <Navigate to='/login' />;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return <Navigate to='/login' />;
    }
};
