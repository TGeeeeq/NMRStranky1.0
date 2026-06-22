"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/admin/actions";

export function ImageUpload({ value, onUploaded }: { value?: string; onUploaded: (url: string) => void }) {
  const [preview, setPreview] = useState(value ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setBusy(false);
    if ("url" in res) {
      setPreview(res.url);
      onUploaded(res.url);
    } else {
      setError(res.error);
    }
  }

  return (
    <div className="rounded-md border-2 border-dashed border-border p-4">
      {preview ? (
        <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-md bg-surface-alt">
          <Image src={preview} alt="Náhled" fill sizes="96px" className="object-cover" />
        </div>
      ) : null}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} disabled={busy} className="text-sm" />
      {busy ? <p className="mt-1 text-sm text-text-muted">Nahrávám…</p> : null}
      {error ? <p className="mt-1 text-sm text-terracotta">{error}</p> : null}
      <p className="mt-1 text-xs text-text-muted">JPG, PNG nebo WebP, max 5 MB.</p>
    </div>
  );
}
