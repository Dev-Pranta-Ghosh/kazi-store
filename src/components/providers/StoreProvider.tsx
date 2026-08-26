"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info } from "lucide-react";
import type { CartItem, Order, User } from "@/lib/types";
import { COUPONS } from "@/lib/utils";

interface Toast {
  id: number;
  message: string;
  kind: "success" | "info";
}

interface StoreApi {
  hydrated: boolean;

  cart: CartItem[];
  cartCount: number;
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  inCart: (productId: string) => boolean;

  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  inWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;

  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, phone: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  requestPasswordReset: (email: string) => { ok: boolean; error?: string };

  orders: Order[];
  placeOrder: (order: Order) => void;
  cancelOrder: (id: string) => void;

  recentlyViewed: string[];
  pushRecentlyViewed: (productId: string) => void;

  recentSearches: string[];
  pushRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;

  coupon: string | null;
  applyCoupon: (code: string, subtotal: number) => { ok: boolean; message: string };
  removeCoupon: () => void;
  discountFor: (subtotal: number) => { amount: number; code: string | null };

  toast: (message: string, kind?: "success" | "info") => void;
}

const StoreContext = createContext<StoreApi | null>(null);

const LS = {
  cart: "kazi_cart_v1",
  wishlist: "kazi_wishlist_v1",
  users: "kazi_users_v1",
  session: "kazi_session_v1",
  orders: "kazi_orders_v1",
  viewed: "kazi_recently_viewed_v1",
  searches: "kazi_recent_searches_v1",
  coupon: "kazi_coupon_v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — ignore */
  }
}

/**
 * Client-side app store for Kazi Store.
 * Cart, wishlist, demo-auth, orders and preferences persist in localStorage.
 * Swap the auth + order sections with real API calls when the
 * production backend is connected — the interface stays the same.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    setCart(read(LS.cart, [] as CartItem[]));
    setWishlist(read(LS.wishlist, [] as string[]));
    setOrders(read(LS.orders, [] as Order[]));
    setRecentlyViewed(read(LS.viewed, [] as string[]));
    setRecentSearches(read(LS.searches, [] as string[]));
    setCoupon(read(LS.coupon, null as string | null));
    const sessionEmail = read<string | null>(LS.session, null);
    if (sessionEmail) {
      const users = read<(User & { password: string })[]>(LS.users, []);
      const found = users.find((u) => u.email === sessionEmail);
      if (found) setUser(stripPassword(found));
    }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) write(LS.cart, cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) write(LS.wishlist, wishlist); }, [wishlist, hydrated]);
  useEffect(() => { if (hydrated) write(LS.orders, orders); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) write(LS.viewed, recentlyViewed); }, [recentlyViewed, hydrated]);
  useEffect(() => { if (hydrated) write(LS.searches, recentSearches); }, [recentSearches, hydrated]);
  useEffect(() => { if (hydrated) write(LS.coupon, coupon); }, [coupon, hydrated]);

  const toast = useCallback((message: string, kind: "success" | "info" = "success") => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((t) => [...t.slice(-3), { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  // ——— CART ———
  const addToCart = useCallback(
    (productId: string, qty = 1) => {
      setCart((c) => {
        const found = c.find((i) => i.productId === productId);
        if (found) return c.map((i) => (i.productId === productId ? { ...i, qty: Math.min(i.qty + qty, 10) } : i));
        return [...c, { productId, qty: Math.min(qty, 10) }];
      });
      toast("Added to your bag");
    },
    [toast]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((c) => c.filter((i) => i.productId !== productId));
  }, []);

  const setQty = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) return removeFromCart(productId);
      setCart((c) => c.map((i) => (i.productId === productId ? { ...i, qty: Math.min(qty, 10) } : i)));
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  // ——— WISHLIST ———
  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((w) => {
        if (w.includes(productId)) {
          toast("Removed from wishlist", "info");
          return w.filter((id) => id !== productId);
        }
        toast("Saved to your wishlist");
        return [...w, productId];
      });
    },
    [toast]
  );

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((w) => w.filter((id) => id !== productId));
  }, []);

  // ——— DEMO AUTH (mock service — swap with real API later) ———
  const signup: StoreApi["signup"] = useCallback((name, email, phone, password) => {
    const users = read<(Registered)[]>(LS.users, []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: "An account with this email already exists." };
    const record: Registered = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      password, // demo only — replace with server-side hashing in production
      createdAt: new Date().toISOString(),
      addresses: [],
    };
    users.push(record);
    write(LS.users, users);
    write(LS.session, record.email);
    setUser(stripPassword(record));
    return { ok: true };
  }, []);

  const login: StoreApi["login"] = useCallback((email, password) => {
    const users = read<Registered[]>(LS.users, []);
    const found = users.find((u) => u.email === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "No account found with this email." };
    if (found.password !== password) return { ok: false, error: "Incorrect password. Please try again." };
    write(LS.session, found.email);
    setUser(stripPassword(found));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    write(LS.session, null);
    setUser(null);
  }, []);

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        const users = read<Registered[]>(LS.users, []);
        const idx = users.findIndex((u) => u.email === prev.email);
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...patch };
          write(LS.users, users);
        }
        return next;
      });
    },
    []
  );

  const requestPasswordReset: StoreApi["requestPasswordReset"] = useCallback((email) => {
    const users = read<Registered[]>(LS.users, []);
    const found = users.some((u) => u.email === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "We couldn't find an account with that email." };
    return { ok: true };
  }, []);

  // ——— ORDERS ———
  const placeOrder = useCallback((order: Order) => {
    setOrders((o) => [order, ...o]);
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setOrders((o) => o.map((ord) => (ord.id === id && ord.status === "Processing" ? { ...ord, status: "Cancelled" } : ord)));
  }, []);

  // ——— RECENT ———
  const pushRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((r) => [productId, ...r.filter((id) => id !== productId)].slice(0, 8));
  }, []);

  const pushRecentSearch = useCallback((q: string) => {
    const clean = q.trim();
    if (!clean) return;
    setRecentSearches((r) => [clean, ...r.filter((x) => x.toLowerCase() !== clean.toLowerCase())].slice(0, 6));
  }, []);

  const clearRecentSearches = useCallback(() => setRecentSearches([]), []);

  // ——— COUPON ———
  const applyCoupon: StoreApi["applyCoupon"] = useCallback((code, subtotal) => {
    const found = COUPONS.find((c) => c.code === code.trim().toUpperCase());
    if (!found) return { ok: false, message: "This code isn't valid. Try WELCOME10." };
    if (subtotal < found.minSpend)
      return { ok: false, message: `${found.code} needs a minimum of ৳${found.minSpend.toLocaleString("en-IN")}.` };
    setCoupon(found.code);
    return { ok: true, message: `${found.code} applied — ${found.value}% off.` };
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const discountFor: StoreApi["discountFor"] = useCallback(
    (subtotal) => {
      if (!coupon) return { amount: 0, code: null };
      const found = COUPONS.find((c) => c.code === coupon);
      if (!found || subtotal < found.minSpend) return { amount: 0, code: null };
      return { amount: Math.round((subtotal * found.value) / 100), code: coupon };
    },
    [coupon]
  );

  const api = useMemo<StoreApi>(
    () => ({
      hydrated,
      cart,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      addToCart,
      removeFromCart,
      setQty,
      clearCart,
      inCart: (id) => cart.some((i) => i.productId === id),
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      inWishlist: (id) => wishlist.includes(id),
      removeFromWishlist,
      user,
      login,
      signup,
      logout,
      updateUser,
      requestPasswordReset,
      orders,
      placeOrder,
      cancelOrder,
      recentlyViewed,
      pushRecentlyViewed,
      recentSearches,
      pushRecentSearch,
      clearRecentSearches,
      coupon,
      applyCoupon,
      removeCoupon,
      discountFor,
      toast,
    }),
    [
      hydrated, cart, wishlist, user, orders, recentlyViewed, recentSearches, coupon,
      addToCart, removeFromCart, setQty, clearCart, toggleWishlist, removeFromWishlist,
      login, signup, logout, updateUser, requestPasswordReset,
      placeOrder, cancelOrder, pushRecentlyViewed, pushRecentSearch, clearRecentSearches,
      applyCoupon, removeCoupon, discountFor, toast,
    ]
  );

  return (
    <StoreContext.Provider value={api}>
      {children}
      {/* Toast stack */}
      <div aria-live="polite" className="pointer-events-none fixed bottom-6 left-1/2 z-[120] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-scale-in flex w-full items-center gap-3 border border-ink/10 bg-ink px-4 py-3 text-sm text-ivory shadow-soft"
          >
            {t.kind === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
            ) : (
              <Info className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

type Registered = User & { password: string };

function stripPassword(u: Registered): User {
  const { password: _password, ...rest } = u;
  void _password;
  return rest;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
