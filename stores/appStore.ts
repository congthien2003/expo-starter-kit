import { create } from "zustand";

interface AppState {
	isLoading: boolean;
	error: string | null;
	isOnline: boolean;

	// Actions
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setOnline: (online: boolean) => void;
	clearError: () => void;
}

export const useAppStore = create<AppState>((set) => ({
	isLoading: false,
	error: null,
	isOnline: true,

	setLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),
	setOnline: (online) => set({ isOnline: online }),
	clearError: () => set({ error: null }),
}));

export default useAppStore;
