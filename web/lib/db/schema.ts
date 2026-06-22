import {
  pgTable, serial, varchar, text, integer, numeric, boolean,
  timestamp, pgEnum, index,
} from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", [
  "pending", "paid", "processing", "shipped", "completed", "cancelled",
]);
export const paymentStatus = pgEnum("payment_status", [
  "pending", "completed", "failed", "refunded",
]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  imageUrl: varchar("image_url", { length: 1000 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_products_category").on(t.categoryId), index("idx_products_active").on(t.isActive)]);

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  imageUrl: varchar("image_url", { length: 1000 }).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
}, (t) => [index("idx_product_images_product").on(t.productId)]);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  variableSymbol: varchar("variable_symbol", { length: 20 }).notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerEmail: varchar("customer_email", { length: 190 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatus("status").default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default("bank_transfer").notNull(),
  paymentStatus: paymentStatus("payment_status").default("pending").notNull(),
  notes: text("notes"),
  customerIp: varchar("customer_ip", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [index("idx_orders_status").on(t.status), index("idx_orders_email").on(t.customerEmail)]);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: varchar("product_name", { length: 200 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
}, (t) => [index("idx_order_items_order").on(t.orderId)]);

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
  lastLoginIp: varchar("last_login_ip", { length: 45 }),
});
