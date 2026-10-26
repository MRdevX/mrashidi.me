import { eq } from "drizzle-orm";
import type { z } from "zod";
import type { Db } from "./index.ts";
import { contentSections } from "./schema.ts";

export type SectionKey = "profile" | "about" | "education" | "certificates" | "skills" | "knowledge";

export async function readSection<T>(db: Db, key: SectionKey, schema: z.ZodType<T>): Promise<T | null> {
  const row = await db.query.contentSections.findFirst({ where: eq(contentSections.key, key) });
  return row ? schema.parse(row.data) : null;
}
