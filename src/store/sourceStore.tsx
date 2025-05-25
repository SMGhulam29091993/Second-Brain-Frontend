import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SourceState {
    source: string | null;
    setSource: (source: string) => void;
    clearSource: () => void;
    getSource: () => string | null;
}

export const useSourceStore = create<SourceState>()(
    persist(
        (set, get) => ({
            source: null,
            setSource: (source: string) => set({ source }),
            clearSource: () => set({ source: null }),
            getSource: () => get().source,
        }),
        { name: 'source-storage' } // Name of the storage key
    )
);
