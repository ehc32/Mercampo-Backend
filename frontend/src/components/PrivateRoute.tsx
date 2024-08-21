import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import jwt_decode from "jwt-decode";
import { Token } from "../Interfaces";

export const PrivateRoute = () => {
    const { isAuth } = useAuthStore();
    return (
        isAuth ? <Outlet /> : <Navigate to='/login' />   
    );
};

export const AdminPrivateRoute = () => {
    const { isAuth } = useAuthStore();
    
    // La decodificación del token se puede mantener si es necesario para otros usos
    const token: string = useAuthStore.getState().access;
    if (token) {
        try {
            // Puedes realizar acciones adicionales con tokenDecoded si es necesario
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }
    
    return (
        isAuth ? <Outlet /> : <Navigate to='/login' />
    );
};
