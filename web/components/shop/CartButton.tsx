"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/obchod/kosik"
      aria-label={`Košík (${count})`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-moss-deep transition-colors hover:text-moss"
    >
      <ShoppingBag size={22} aria-hidden />
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-terracotta px-1 text-xs font-semibold text-cream">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
