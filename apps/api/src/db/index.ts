import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function createDb(db: D1Database) {
  return drizzle(db, { schema, casing: "snake_case" });
}

export type Db = ReturnType<typeof createDb>;
