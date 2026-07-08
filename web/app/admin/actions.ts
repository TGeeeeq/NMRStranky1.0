"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { getSession, requireAdmin } from "@/lib/auth";
import { saveImage } from "@/lib/storage";
import { productSchema, categorySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { generateInviteCode } from "@/lib/game-access";

// ============================ auth ============================
export type LoginState = { error?: string };

// Dummy hash pro porovnání, když uživatel neexistuje — sjednotí dobu odpovědi
// (jinak by neexistující jméno vracelo mnohem rychleji a prozradilo platná jména).
const DUMMY_HASH = "$2b$12$MWG5Kh.9L4IxUEx4TbEv5uXBZVdGJLj0i533YrLryr90dpb4OG30m";

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const h = await headers();
  const clientIp = (h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  // Brute-force / credential-stuffing throttle: per IP i per jméno.
  const ipLimit = rateLimit(`login:ip:${clientIp}`, 10, 300);
  const userLimit = rateLimit(`login:user:${username.toLowerCase()}`, 5, 300);
  if (!ipLimit.allowed || !userLimit.allowed) {
    return { error: "Příliš mnoho pokusů o přihlášení. Zkuste to prosím za pár minut." };
  }

  const rows = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
  const admin = rows[0];
  const passwordOk = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !passwordOk) {
    return { error: "Nesprávné jméno nebo heslo." };
  }

  const session = await getSession();
  session.adminId = admin.id;
  session.username = admin.username;
  await session.save();

  await db.update(schema.admins).set({ lastLoginAt: new Date(), lastLoginIp: clientIp }).where(eq(schema.admins.id, admin.id));

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}

// ============================ images ============================
export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Žádný soubor." };
  if (file.size > 5 * 1024 * 1024) return { error: "Soubor je větší než 5 MB." };
  const allowed: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const ext = allowed[file.type];
  if (!ext) return { error: "Povolené formáty: JPG, PNG, WebP." };
  // saveImage stores to Netlify Blobs and returns the same-origin /img/<key> path.
  const url = await saveImage(`upload.${ext}`, await file.arrayBuffer(), file.type);
  return { url };
}

// ============================ products ============================
export type FormState = { error?: string };

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    stock_quantity: formData.get("stock_quantity") ?? 0,
    category_id: formData.get("category_id") || null,
    image_url: formData.get("image_url") || "",
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "1",
  });
  if (!parsed.success) {
    return { error: "Zkontrolujte pole: " + parsed.error.issues.map((i) => i.path.join(".")).join(", ") };
  }
  const v = parsed.data;
  const values = {
    name: v.name, slug: v.slug, description: v.description, price: String(v.price),
    stockQuantity: v.stock_quantity, categoryId: v.category_id ?? null,
    imageUrl: v.image_url || null, isActive: v.is_active, updatedAt: new Date(),
  };

  try {
    if (id) await db.update(schema.products).set(values).where(eq(schema.products.id, id));
    else await db.insert(schema.products).values(values);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "23505") return { error: "Tento slug už existuje, zvolte jiný." };
    console.error("[saveProduct]", e);
    return { error: "Chyba při uložení." };
  }

  revalidatePath("/obchod");
  revalidatePath(`/obchod/${v.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.delete(schema.products).where(eq(schema.products.id, id));
  revalidatePath("/obchod");
  redirect("/admin/products");
}

export async function addProductImage(productId: number, url: string): Promise<{ id: number } | { error: string }> {
  await requireAdmin();
  if (!Number.isInteger(productId) || productId <= 0) return { error: "Neplatný produkt." };
  if (!/^\/[^\s"'<>]{1,999}$/.test(url)) return { error: "Neplatná adresa obrázku." };
  const max = await db
    .select({ m: sql<number>`coalesce(max(${schema.productImages.displayOrder}), -1)::int` })
    .from(schema.productImages).where(eq(schema.productImages.productId, productId));
  const ins = await db.insert(schema.productImages)
    .values({ productId, imageUrl: url, displayOrder: (max[0]?.m ?? -1) + 1 })
    .returning({ id: schema.productImages.id });
  return { id: ins[0].id };
}

export async function deleteProductImage(imageId: number): Promise<void> {
  await requireAdmin();
  await db.delete(schema.productImages).where(eq(schema.productImages.id, imageId));
}

// ============================ categories ============================
export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const parsed = categorySchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"),
    description: formData.get("description") ?? "", display_order: formData.get("display_order") ?? 0,
  });
  if (!parsed.success) return { error: "Zkontrolujte pole kategorie." };
  const v = parsed.data;
  const values = { name: v.name, slug: v.slug, description: v.description, displayOrder: v.display_order };
  try {
    if (id) await db.update(schema.categories).set(values).where(eq(schema.categories.id, id));
    else await db.insert(schema.categories).values(values);
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "23505") return { error: "Tento slug kategorie už existuje." };
    console.error("[saveCategory]", e);
    return { error: "Chyba při uložení kategorie." };
  }
  revalidatePath("/obchod");
  redirect("/admin/categories");
}

// Plain form-action wrapper (returns void) for use without useActionState.
export async function saveCategoryForm(formData: FormData): Promise<void> {
  await saveCategory({}, formData);
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await db.delete(schema.categories).where(eq(schema.categories.id, id));
  revalidatePath("/obchod");
  redirect("/admin/categories");
}

// ============================ orders ============================
const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "completed", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "completed", "failed", "refunded"] as const;

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  const paymentStatus = String(formData.get("payment_status"));
  if (!id || !ORDER_STATUSES.includes(status as never) || !PAYMENT_STATUSES.includes(paymentStatus as never)) return;
  await db.update(schema.orders)
    .set({
      status: status as (typeof ORDER_STATUSES)[number],
      paymentStatus: paymentStatus as (typeof PAYMENT_STATUSES)[number],
      updatedAt: new Date(),
    })
    .where(eq(schema.orders.id, id));
  redirect(`/admin/orders/${id}`);
}

// ============================ hra (Louka Run) ============================
export async function createGameInvites(formData: FormData): Promise<void> {
  await requireAdmin();
  const count = Math.min(Math.max(Number(formData.get("count")) || 1, 1), 50);
  const note = String(formData.get("note") ?? "").trim().slice(0, 200) || null;
  const values = Array.from({ length: count }, () => ({ code: generateInviteCode(), note }));
  await db.insert(schema.gameInvites).values(values);
  redirect("/admin/hra");
}

export async function revokeGameInvite(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await db.update(schema.gameInvites)
      .set({ revokedAt: new Date() })
      .where(eq(schema.gameInvites.id, id));
  }
  redirect("/admin/hra");
}
