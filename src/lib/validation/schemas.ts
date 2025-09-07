import { z } from "zod";

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .trim()
  .regex(/^[a-zA-ZÀ-ÿ\s\-'.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods");

const emailSchema = z
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters")
  .trim()
  .toLowerCase();

const subjectSchema = z
  .string()
  .min(5, "Subject must be at least 5 characters")
  .max(100, "Subject must be less than 100 characters")
  .trim();

const messageSchema = z
  .string()
  .min(10, "Message must be at least 10 characters")
  .max(1000, "Message must be less than 1000 characters")
  .trim();

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: subjectSchema,
  message: messageSchema,
});

export const resumeRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: z.string().trim().max(100, "Company must be less than 100 characters").optional(),
});

export const blogSearchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(100, "Query too long").trim(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export const projectFilterSchema = z.object({
  search: z.string().optional().default(""),
  stacks: z.array(z.string()).optional(),
  openSourceOnly: z.boolean().optional(),
  type: z.enum(["all", "personal", "client"]).default("all"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ResumeRequestData = z.infer<typeof resumeRequestSchema>;
export type BlogSearchData = z.infer<typeof blogSearchSchema>;
export type ProjectFilterData = z.infer<typeof projectFilterSchema>;
