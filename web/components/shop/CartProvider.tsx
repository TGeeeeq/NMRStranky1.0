"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartItem } from "@/lib/cart";
import { addItem, setQty, removeItem, cartCount, loadCart, saveCart, clearCart } from "@/lib/cart";

type CartCtx = {
  items: CartItem[];
  count: number;
  add: (id: number, qty?: number) => void;
  updateQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  ready: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) saveCart(items);
  }, [items, ready]);

  const add = useCallback((id: number, qty = 1) => setItems((c) => addItem(c, id, qty)), []);
  const updateQty = useCallback((id: number, qty: number) => setItems((c) => setQty(c, id, qty)), []);
  const remove = useCallback((id: number) => setItems((c) => removeItem(c, id)), []);
  const clear = useCallback(() => {
    clearCart();
    setItems([]);
  }, []);

  return (
    <Ctx.Provider value={{ items, count: cartCount(items), add, updateQty, remove, clear, ready }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
