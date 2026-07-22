import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { Price } from "@/components/shop/Price";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { getProductBySlug, getProductImages } from "@/lib/db/queries";
import { getLocale } from "@/lib/i18n.server";
import { pick } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await getProductBySlug(slug);
  if (!p) return { title: pick(locale, { cs: "Produkt nenalezen", en: "Product not found" }) };
  return {
    title: p.name,
    description: p.description || pick(locale, { cs: `${p.name} — Luční obchůdek Nech mě růst.`, en: `${p.name} — the Nech mě růst Meadow shop.` }),
    alternates: { canonical: `/obchod/${p.slug}` },
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const gallery = await getProductImages(product.id);
  const images = [product.imageUrl, ...gallery.map((g) => g.imageUrl)].filter(Boolean) as string[];
  const soldOut = product.stockQuantity <= 0;

  return (
    <section className="bg-surface py-12 sm:py-16">
      <Container>
        <Link href="/obchod" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-moss-deep hover:text-moss">
          <ArrowLeft size={16} aria-hidden /> {pick(locale, { cs: "Zpět do obchodu", en: "Back to the shop" })}
        </Link>
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={images} alt={product.name} />
          <div className="flex flex-col">
            <h1 className="font-serif text-3xl font-semibold text-moss-deep sm:text-4xl">{product.name}</h1>
            <Price value={product.price} className="mt-4 text-2xl font-semibold text-moss" />
            <p className={`mt-2 text-sm ${soldOut ? "text-terracotta" : "text-text-muted"}`}>
              {soldOut ? pick(locale, { cs: "Momentálně vyprodáno", en: "Currently sold out" }) : pick(locale, { cs: `Skladem: ${product.stockQuantity} ks`, en: `In stock: ${product.stockQuantity} pcs` })}
            </p>
            {product.description ? (
              <p className="mt-6 whitespace-pre-line leading-relaxed text-text">{product.description}</p>
            ) : null}
            <div className="mt-8">
              <AddToCartButton productId={product.id} disabled={soldOut} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
