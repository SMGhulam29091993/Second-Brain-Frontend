import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
    getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            setToken: (token: string) => set({ token }),
            getToken: () => get().token,
            clearToken: () => set({ token: null }),
        }),
        { name: 'token-storage' }
    )
);
