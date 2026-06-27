import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await db.select({ id: schema.categories.id, name: schema.categories.name })
    .from(schema.categories).orderBy(asc(schema.categories.displayOrder));
  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Přidat produkt</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
