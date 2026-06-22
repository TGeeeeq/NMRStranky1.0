export type CartItem = { id: number; quantity: number };
const KEY = "nmr_cart";

export function addItem(cart: CartItem[], id: number, qty = 1): CartItem[] {
  const existing = cart.find((i) => i.id === id);
  if (existing) return cart.map((i) => (i.id === id ? { ...i, quantity: i.quantity + qty } : i));
  return [...cart, { id, quantity: qty }];
}
export function setQty(cart: CartItem[], id: number, qty: number): CartItem[] {
  const q = Math.max(1, Math.min(100, Math.floor(qty)));
  return cart.map((i) => (i.id === id ? { ...i, quantity: q } : i));
}
export function removeItem(cart: CartItem[], id: number): CartItem[] {
  return cart.filter((i) => i.id !== id);
}
export function cartCount(cart: CartItem[]): number {
  return cart.reduce((n, i) => n + i.quantity, 0);
}

// localStorage wrappers (browser only)
export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cart));
}
export function clearCart(): void {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}
