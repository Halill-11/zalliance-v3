import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@shared/types';
export interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}
interface AppState {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
}
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: () => set({ isAdmin: true }),
      logout: () => set({ isAdmin: false }),
      cart: [],
      addToCart: (product, size) => set((state) => {
        const existingItemIndex = state.cart.findIndex(
          (item) => item.id === product.id && item.selectedSize === size
        );
        if (existingItemIndex > -1) {
          const newCart = [...state.cart];
          newCart[existingItemIndex].quantity += 1;
          return { cart: newCart };
        } else {
          return { cart: [...state.cart, { ...product, selectedSize: size, quantity: 1 }] };
        }
      }),
      removeFromCart: (productId, size) => set((state) => ({
        cart: state.cart.filter((item) => !(item.id === productId && item.selectedSize === size))
      })),
      updateQuantity: (productId, size, delta) => set((state) => {
        const newCart = state.cart.map((item) => {
          if (item.id === productId && item.selectedSize === size) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        return { cart: newCart };
      }),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'zalliance-storage',
    }
  )
);