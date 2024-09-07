import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    access: string;
    refresh: string;
    isAuth: boolean;
    role: string;
}

type Actions = {
    setToken: (access: string, refresh: string, role: string) => void;
    logout: () => void;
};

export const useAuthStore = create(
    persist<State & Actions>(
        (set) => ({
            access: '',
            refresh: '',
            isAuth: false,
            role: '',  // Inicializa el rol como una cadena vacía
            setToken: (access: string, refresh: string, role: string) => 
                set(() => ({
                    access,
                    refresh,
                    isAuth: !!access && !!refresh,  // Verifica si ambos tokens existen
                    role,  // Establece el rol del usuario
                })),
            logout: () => set(() => ({ 
                access: '', 
                refresh: '', 
                isAuth: false, 
                role: ''  // Restablece todos los valores a sus estados iniciales
            })), 
        }),
        {
            name: "auth",  // Nombre de la clave para el almacenamiento persistente
            getStorage: () => localStorage,  // Puedes ajustar esto para usar sessionStorage u otro almacenamiento si lo prefieres
        }
    )
);
