import { ProjectSchema } from "@mrashidi/types";
import { asc, eq } from "drizzle-orm";
import type { Db } from "#db/index.ts";
import { projects } from "#db/schema.ts";
import type { ProjectRepository } from "../domain/project-repository.ts";

export function createD1ProjectRepository(db: Db): ProjectRepository {
  return {
    async list() {
      const rows = await db.select({ data: projects.data }).from(projects).orderBy(asc(projects.position));
      return rows.map((row) => ProjectSchema.parse(row.data));
    },
    async getBySlug(slug) {
      const row = await db.query.projects.findFirst({ where: eq(projects.slug, slug) });
      return row ? ProjectSchema.parse(row.data) : null;
    },
  };
}
