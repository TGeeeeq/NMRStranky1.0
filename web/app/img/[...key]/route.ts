import { imageStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const blob = await imageStore().getWithMetadata(key.join("/"), { type: "arrayBuffer" });
  if (!blob) return new Response("Not found", { status: 404 });
  const contentType = (blob.metadata?.contentType as string) || "application/octet-stream";
  return new Response(blob.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
