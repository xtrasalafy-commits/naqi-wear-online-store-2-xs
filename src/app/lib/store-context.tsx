"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ═══════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════ */

export interface CartItem {
  id: number;
  productId: number;
  variantId: number | null;
  nama: string;
  gambarUrl: string;
  warna: string | null;
  ukuran: string | null;
  harga: number;
  qty: number;
  stok: number;
}

export interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface StoreContextValue {
  /* Cart */
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateCartQty: (variantId: number, qty: number) => void;
  removeFromCart: (variantId: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartSubtotal: () => number;

  /* Auth */
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  /* Wishlist */
  wishlist: number[];
  toggleWishlist: (productId: number) => void;

  /* Toast */
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

/* ═══════════════════════════════════════════════════════════
   Provider
   ═══════════════════════════════════════════════════════════ */

let toastId = 0;

export function StoreProvider({ children }: { children: ReactNode }) {
  /* ── Cart ─────────────────────────────────────────── */
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "id">) => {
      setCart((prev) => {
        const existing = prev.find((c) => c.variantId === item.variantId);
        if (existing) {
          return prev.map((c) =>
            c.variantId === item.variantId
              ? { ...c, qty: Math.min(c.qty + item.qty, c.stok) }
              : c
          );
        }
        return [...prev, { ...item, id: Date.now() }];
      });
      addToast(`${item.nama} ditambahkan ke keranjang!`, "success");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const updateCartQty = useCallback((variantId: number, qty: number) => {
    setCart((prev) =>
      prev.map((c) =>
        c.variantId === variantId ? { ...c, qty: Math.max(1, Math.min(qty, c.stok)) } : c
      )
    );
  }, []);

  const removeFromCart = useCallback((variantId: number) => {
    setCart((prev) => prev.filter((c) => c.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useCallback(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);
  const cartSubtotal = useCallback(
    () => cart.reduce((s, c) => s + c.harga * c.qty, 0),
    [cart]
  );

  /* ── Auth ─────────────────────────────────────────── */
  const [user, setUser] = useState<User | null>(null);
  const login = useCallback((u: User) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  /* ── Wishlist ─────────────────────────────────────── */
  const [wishlist, setWishlist] = useState<number[]>([]);
  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  /* ── Toast ────────────────────────────────────────── */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback(
    (message: string, type: Toast["type"] = "info") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        user,
        login,
        logout,
        wishlist,
        toggleWishlist,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

/* ═══════════════════════════════════════════════════════════
   Hook
   ═══════════════════════════════════════════════════════════ */

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
