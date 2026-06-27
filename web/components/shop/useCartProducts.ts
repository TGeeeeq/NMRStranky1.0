"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export type CartProduct = {
  id: number; name: string; slug: string; price: string;
  imageUrl: string | null; stockQuantity: number;
};
export type CartLine = CartProduct & { quantity: number };

export function useCartProducts(): { lines: CartLine[]; loading: boolean } {
  const { items } = useCart();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const idsKey = items.map((i) => i.id).sort((a, b) => a - b).join(",");

  useEffect(() => {
    if (!idsKey) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/obchod/cart-data?ids=${idsKey}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, [idsKey]);

  const lines = items
    .map((i) => {
      const p = products.find((x) => x.id === i.id);
      return p ? { ...p, quantity: i.quantity } : null;
    })
    .filter((x): x is CartLine => x !== null);

  return { lines, loading };
}
