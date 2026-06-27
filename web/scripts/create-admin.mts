// Run: npm run admin:create  (reads DATABASE_URL from .env.local)
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema.ts";

const rl = createInterface({ input: stdin, output: stdout });
const username = (await rl.question("Admin username: ")).trim();
const email = (await rl.question("Admin email: ")).trim();
const password = (await rl.question("Admin password (min 10 chars): ")).trim();
rl.close();
if (password.length < 10) {
  console.error("Password too short.");
  process.exit(1);
}

const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }), { schema });
const passwordHash = await bcrypt.hash(password, 12);

const existing = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
if (existing[0]) {
  await db.update(schema.admins).set({ passwordHash, email }).where(eq(schema.admins.username, username));
  console.log(`Updated admin '${username}'.`);
} else {
  await db.insert(schema.admins).values({ username, email, passwordHash });
  console.log(`Created admin '${username}'.`);
}
process.exit(0);
