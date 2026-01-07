import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface AppState {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  cartCount: number;
  addToCart: () => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: () => set({ isAdmin: true }),
      logout: () => set({ isAdmin: false }),
      cartCount: 0,
      addToCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
    }),
    {
      name: 'zalliance-storage',
    }
  )
);