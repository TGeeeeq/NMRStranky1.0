import { getProductsByIds } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const idsParam = new URL(req.url).searchParams.get("ids") ?? "";
  const ids = idsParam.split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0);
  const rows = await getProductsByIds(ids);
  const products = rows.map((p) => ({
    id: p.id, name: p.name, slug: p.slug, price: p.price,
    imageUrl: p.imageUrl, stockQuantity: p.stockQuantity,
  }));
  return Response.json({ products });
}
