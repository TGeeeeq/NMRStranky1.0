#!/usr/bin/env python3
"""One-off backup of the live Forpsi shop before hosting ends (29th).
Pulls products + categories + gallery JSON and downloads every product photo
into web/data/forpsi-export/. This snapshot becomes the migration source, so
the new site no longer depends on Forpsi being online.

NOTE: the public API only returns ACTIVE products. For a complete backup
(hidden products + orders), also do a phpMyAdmin SQL export of DB f193818.
"""
import json, os, ssl, urllib.request, urllib.error

BASE = "https://nechmerust.org"
OUT = "/home/tonyfg/Desktop/projekty/stranky/web/data/forpsi-export"
os.makedirs(OUT + "/images", exist_ok=True)
CTX = ssl.create_default_context()


def get_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "nmr-export"})
    with urllib.request.urlopen(req, context=CTX, timeout=45) as r:
        return r.read()


def get_json(path: str):
    return json.loads(get_bytes(BASE + path).decode("utf-8"))


def write_json(name: str, data) -> None:
    with open(f"{OUT}/{name}", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


cats = get_json("/api/categories.php")
write_json("categories.json", cats)

prods = get_json("/api/products.php")
write_json("products.json", prods)
products = prods.get("products", [])

gallery, images = {}, set()
for p in products:
    if p.get("image_url"):
        images.add(p["image_url"])
    pid = p["id"]
    try:
        gi = get_json(f"/api/product-images.php?product_id={pid}")
        imgs = gi.get("images", [])
        gallery[str(pid)] = imgs
        for im in imgs:
            if im.get("image_url"):
                images.add(im["image_url"])
    except Exception as e:  # keep going; we want as much as possible
        print(f"  ! gallery {pid}: {e}")
write_json("gallery.json", gallery)

ok = fail = 0
for path in sorted(images):
    url = path if path.startswith("http") else BASE + path
    fn = os.path.basename(path.split("?")[0])
    try:
        with open(f"{OUT}/images/{fn}", "wb") as f:
            f.write(get_bytes(url))
        ok += 1
    except Exception as e:
        print(f"  ! image {url}: {e}")
        fail += 1

print(f"\ncategories: {len(cats.get('categories', []))}")
print(f"products:   {len(products)}")
print(f"images:     {ok} ok, {fail} failed")
