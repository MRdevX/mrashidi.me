import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentSections = sqliteTable("content_sections", {
  key: text().primaryKey(),
  data: text({ mode: "json" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
});

export const projects = sqliteTable("projects", {
  slug: text().primaryKey(),
  position: integer().notNull(),
  data: text({ mode: "json" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
});

export const workExperience = sqliteTable("work_experience", {
  position: integer().primaryKey(),
  data: text({ mode: "json" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
});
