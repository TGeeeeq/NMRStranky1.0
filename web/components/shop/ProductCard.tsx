"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Price } from "./Price";

export type ProductCardData = {
  slug: string; name: string; price: string;
  imageUrl: string | null; stockQuantity: number; categoryName: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const soldOut = product.stockQuantity <= 0;
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-accent hover:shadow-lift"
    >
      <Link href={`/obchod/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-surface-alt">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
          {soldOut ? (
            <span className="absolute left-3 top-3 rounded-pill bg-text-muted px-3 py-1 text-xs font-semibold text-cream">
              Vyprodáno
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {product.categoryName ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{product.categoryName}</p>
        ) : null}
        <h2 className="mt-1 font-serif text-lg font-semibold text-moss-deep">
          <Link href={`/obchod/${product.slug}`} className="hover:text-moss">{product.name}</Link>
        </h2>
        <div className="mt-auto pt-3">
          <Price value={product.price} className="text-lg font-semibold text-moss-deep" />
        </div>
      </div>
    </motion.article>
  );
}
