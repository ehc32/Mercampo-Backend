import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AbiertoStore {
    abierto: boolean;
    toggleAbierto: () => void;
}
export const useAbierto = create<AbiertoStore>()(
    persist(
        (set) => ({
            abierto: false,
            toggleAbierto: (newState: boolean) => set({ abierto: newState }),
        }),
        {
            name: 'abierto',
        }
    )
);