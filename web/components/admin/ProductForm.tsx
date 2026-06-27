"use client";

import { useActionState, useState } from "react";
import { saveProduct, type FormState } from "@/app/admin/actions";
import { ImageUpload } from "./ImageUpload";

type Category = { id: number; name: string };
type Product = {
  id: number; name: string; slug: string; description: string | null;
  price: string; stockQuantity: number; categoryId: number | null; imageUrl: string | null; isActive: boolean;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const field = "w-full rounded-md border border-border bg-surface px-3 py-2.5 focus:border-moss focus:outline-none";
const initial: FormState = {};

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveProduct, initial);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="image_url" value={imageUrl} />

      <label className="block"><span className="text-sm font-medium">Název *</span>
        <input name="name" required maxLength={200} defaultValue={product?.name}
          onChange={(e) => { if (!product) setSlug(slugify(e.target.value)); }} className={field} /></label>

      <label className="block"><span className="text-sm font-medium">URL slug *</span>
        <input name="slug" required pattern="[a-z0-9-]+" value={slug} onChange={(e) => setSlug(e.target.value)} className={field} />
        <span className="text-xs text-text-muted">Jen malá písmena bez diakritiky, číslice, pomlčky.</span></label>

      <label className="block"><span className="text-sm font-medium">Kategorie</span>
        <select name="category_id" defaultValue={product?.categoryId ?? ""} className={field}>
          <option value="">— Bez kategorie —</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select></label>

      <label className="block"><span className="text-sm font-medium">Popis</span>
        <textarea name="description" rows={5} defaultValue={product?.description ?? ""} className={field} /></label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-medium">Cena (Kč) *</span>
          <input name="price" type="number" min={1} step={1} required defaultValue={product?.price} className={field} /></label>
        <label className="block"><span className="text-sm font-medium">Skladem (ks)</span>
          <input name="stock_quantity" type="number" min={0} defaultValue={product?.stockQuantity ?? 0} className={field} /></label>
      </div>

      <div><span className="text-sm font-medium">Hlavní obrázek</span>
        <div className="mt-1"><ImageUpload value={imageUrl} onUploaded={setImageUrl} /></div></div>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_active" defaultChecked={product ? product.isActive : true} />
        <span className="text-sm font-medium">Aktivní (zobrazit v obchodě)</span></label>

      {state.error ? <p className="rounded-md bg-terracotta/10 px-3 py-2 text-sm text-terracotta">{state.error}</p> : null}

      <button type="submit" disabled={pending}
        className="inline-flex items-center rounded-pill bg-moss px-6 py-3 font-medium text-cream hover:bg-moss-deep disabled:opacity-60">
        {pending ? "Ukládám…" : product ? "Uložit změny" : "Vytvořit produkt"}
      </button>
    </form>
  );
}
