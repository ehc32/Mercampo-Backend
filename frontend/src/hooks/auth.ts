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
                    isAuth: !!access && !!refresh,
                    role,  // Establece el rol del usuario
                })),
            logout: () => set(() => ({ access: '', refresh: '', isAuth: false, role: '' })), 
        }),
        {
            name: "auth"
        }
    )
);
