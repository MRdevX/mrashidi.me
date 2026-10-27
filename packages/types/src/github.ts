import { z } from "zod";

export const ContributionLevelSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]);

export const ContributionDaySchema = z.object({
  date: z.iso.date(),
  count: z.number().int().nonnegative(),
  level: ContributionLevelSchema,
});

export const ContributionsSchema = z.object({
  contributions: z.array(ContributionDaySchema),
  total: z.number().int().nonnegative(),
});

export type ContributionLevel = z.infer<typeof ContributionLevelSchema>;
export type ContributionDay = z.infer<typeof ContributionDaySchema>;
export type Contributions = z.infer<typeof ContributionsSchema>;
