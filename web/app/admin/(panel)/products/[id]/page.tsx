import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getProductImages } from "@/lib/db/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) notFound();
  const rows = await db.select().from(schema.products).where(eq(schema.products.id, numId));
  const product = rows[0];
  if (!product) notFound();

  const [categories, images] = await Promise.all([
    db.select({ id: schema.categories.id, name: schema.categories.name }).from(schema.categories).orderBy(asc(schema.categories.displayOrder)),
    getProductImages(product.id),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Upravit produkt</h1>
      <ProductForm product={product} categories={categories} />
      <div className="mt-10 max-w-2xl">
        <h2 className="mb-3 font-serif text-lg font-semibold text-moss-deep">Další fotografie</h2>
        <GalleryManager productId={product.id} initial={images.map((i) => ({ id: i.id, imageUrl: i.imageUrl }))} />
      </div>
    </div>
  );
}
