import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/lib/currency";

export interface CartItem {
  productId: string;
  qty: number;
  /** Set for promotional items that were added automatically (free gift). */
  gift?: boolean;
}

interface ShopState {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  currency: Currency;
  theme: "light" | "dark";
  cartOpen: boolean;
  quickViewSlug: string | null;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  addGift: (id: string) => void;
  removeGift: (id: string) => void;
  toggleWishlist: (id: string) => void;
  addRecent: (id: string) => void;
  setCurrency: (c: Currency) => void;
  toggleTheme: () => void;
  openCart: () => void;
  closeCart: () => void;
  setQuickView: (slug: string | null) => void;
}

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      currency: "USD",
      theme: "light",
      cartOpen: false,
      quickViewSlug: null,
      addToCart: (id, qty = 1) => {
        const existing = get().cart.find((i) => i.productId === id);
        if (existing) {
          set({ cart: get().cart.map((i) => i.productId === id ? { ...i, qty: i.qty + qty, gift: false } : i) });
        } else {
          set({ cart: [...get().cart, { productId: id, qty }] });
        }
      },
      removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.productId !== id) }),
      updateQty: (id, qty) => set({
        cart: qty <= 0
          ? get().cart.filter((i) => i.productId !== id)
          : get().cart.map((i) => i.productId === id ? { ...i, qty } : i),
      }),
      clearCart: () => set({ cart: [] }),
      addGift: (id) => {
        if (get().cart.some((i) => i.productId === id)) return;
        set({ cart: [...get().cart, { productId: id, qty: 1, gift: true }] });
      },
      removeGift: (id) => set({ cart: get().cart.filter((i) => !(i.productId === id && i.gift)) }),
      toggleWishlist: (id) => {
        const w = get().wishlist;
        set({ wishlist: w.includes(id) ? w.filter((x) => x !== id) : [...w, id] });
      },
      addRecent: (id) => {
        const r = [id, ...get().recentlyViewed.filter((x) => x !== id)].slice(0, 8);
        set({ recentlyViewed: r });
      },
      setCurrency: (currency) => set({ currency }),
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
      },
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      setQuickView: (quickViewSlug) => set({ quickViewSlug }),
    }),
    {
      name: "sultanet-shop",
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
        currency: s.currency,
        theme: s.theme,
      }),
    },
  ),
);
