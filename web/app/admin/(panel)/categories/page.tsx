import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { saveCategoryForm, deleteCategory } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
const field = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:border-moss focus:outline-none";

export default async function AdminCategories() {
  await requireAdmin();
  const cats = await db.select().from(schema.categories).orderBy(asc(schema.categories.displayOrder));
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-2xl font-semibold text-moss-deep">Kategorie</h1>

      <form action={saveCategoryForm} className="mb-8 grid gap-3 rounded-lg border border-border bg-surface p-5 sm:grid-cols-[1fr_1fr_80px_auto] sm:items-end">
        <label className="block"><span className="text-xs font-medium">Název</span><input name="name" required className={field} /></label>
        <label className="block"><span className="text-xs font-medium">Slug</span><input name="slug" required pattern="[a-z0-9-]+" className={field} /></label>
        <label className="block"><span className="text-xs font-medium">Pořadí</span><input name="display_order" type="number" min={0} defaultValue={cats.length + 1} className={field} /></label>
        <button type="submit" className="rounded-pill bg-moss px-5 py-2 text-sm font-medium text-cream hover:bg-moss-deep">Přidat</button>
      </form>

      <div className="space-y-3">
        {cats.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-4">
            <form action={saveCategoryForm} className="grid gap-3 sm:grid-cols-[1fr_1fr_80px_auto] sm:items-end">
              <input type="hidden" name="id" value={c.id} />
              <label className="block"><span className="text-xs font-medium">Název</span><input name="name" required defaultValue={c.name} className={field} /></label>
              <label className="block"><span className="text-xs font-medium">Slug</span><input name="slug" required pattern="[a-z0-9-]+" defaultValue={c.slug} className={field} /></label>
              <label className="block"><span className="text-xs font-medium">Pořadí</span><input name="display_order" type="number" min={0} defaultValue={c.displayOrder} className={field} /></label>
              <button type="submit" className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-moss-deep hover:bg-surface-alt">Uložit</button>
            </form>
            <form action={deleteCategory} className="mt-2">
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="text-xs text-terracotta hover:underline">Smazat kategorii</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
