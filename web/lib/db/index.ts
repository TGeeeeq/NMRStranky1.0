import "server-only";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { env } from "../env";

// Pool driver (not neon-http) so the order Server Action can use db.transaction().
const pool = new Pool({ connectionString: env.databaseUrl() });
export const db = drizzle(pool, { schema });
export { schema };
