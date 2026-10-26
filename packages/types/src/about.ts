import { z } from "zod";

export const AboutBioStyleSchema = z.enum(["prominent", "subtle", "brand"]);

export const AboutBioSegmentSchema = z.object({
  text: z.string().min(1),
  style: AboutBioStyleSchema.optional(),
});

export const LanguageSchema = z.object({
  language: z.string().min(1),
  level: z.string().min(1),
  progress: z.number().int().min(0).max(100),
});

export const AboutSchema = z.object({
  bio: z.array(AboutBioSegmentSchema).min(1),
  languages: z.array(LanguageSchema),
  contactCta: z.string(),
  contactDescription: z.string(),
});

export type AboutBioStyle = z.infer<typeof AboutBioStyleSchema>;
export type AboutBioSegment = z.infer<typeof AboutBioSegmentSchema>;
export type Language = z.infer<typeof LanguageSchema>;
export type About = z.infer<typeof AboutSchema>;
