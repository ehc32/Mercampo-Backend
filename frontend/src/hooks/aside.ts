import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AbiertoStore {
    abierto: boolean;
}

const useAbierto = create<AbiertoStore>()(
    persist(
        (set) => ({
            abierto: false,
        }),
        {
            name: 'abierto',
        }
    )
);

const toggleAbierto = (newState: boolean) => {
    useAbierto.setState({ abierto: newState });
};

export { useAbierto, toggleAbierto };