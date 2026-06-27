"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage, addProductImage, deleteProductImage } from "@/app/admin/actions";

type Img = { id: number; imageUrl: string };

export function GalleryManager({ productId, initial }: { productId: number; initial: Img[] }) {
  const [images, setImages] = useState<Img[]>(initial);
  const [busy, setBusy] = useState(false);

  async function onAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    if ("url" in res) {
      await addProductImage(productId, res.url);
      setImages((cur) => [...cur, { id: Date.now(), imageUrl: res.url }]);
    }
    setBusy(false);
    e.target.value = "";
  }

  async function onDelete(id: number) {
    await deleteProductImage(id);
    setImages((cur) => cur.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((im) => (
          <div key={im.id} className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-md bg-surface-alt">
              <Image src={im.imageUrl} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <button type="button" onClick={() => onDelete(im.id)}
              className="mt-1 w-full text-xs text-terracotta hover:underline">Smazat</button>
          </div>
        ))}
      </div>
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onAdd} disabled={busy} className="mt-3 text-sm" />
      {busy ? <p className="mt-1 text-sm text-text-muted">Nahrávám…</p> : null}
    </div>
  );
}
