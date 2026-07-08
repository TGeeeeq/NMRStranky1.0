import { z } from "zod";

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(1).max(100),
  customer_email: z.string().trim().email().max(190),
  customer_phone: z.string().trim().max(30).optional().default(""),
  street: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postal_code: z.string().trim().min(1).max(20),
  notes: z.string().trim().max(1000).optional().default(""),
  items: z
    .array(
      z.object({
        product_id: z.number().int().positive(),
        quantity: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(50),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,200}$/, "Slug: jen a-z, 0-9, pomlčky"),
  description: z.string().max(5000).optional().default(""),
  price: z.coerce.number().positive(),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  category_id: z.coerce.number().int().positive().nullable().optional(),
  // Jen same-origin relativní cesta (začíná „/"), bez mezer a znaků umožňujících
  // javascript:/data: nebo injektáž. Prázdná hodnota = bez obrázku.
  image_url: z
    .string()
    .max(1000)
    .refine((v) => v === "" || /^\/[^\s"'<>]*$/.test(v), "Neplatná adresa obrázku")
    .optional()
    .default(""),
  is_active: z.coerce.boolean().default(true),
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,100}$/),
  description: z.string().max(2000).optional().default(""),
  display_order: z.coerce.number().int().min(0).default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;
