"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-alt">
        {list[active] ? (
          <Image src={list[active]} alt={alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" priority />
        ) : null}
      </div>
      {list.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2",
                i === active ? "border-moss" : "border-border",
              )}
            >
              <Image src={src} alt={`${alt} – náhled ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
