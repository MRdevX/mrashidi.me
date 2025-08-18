import { z } from "zod";

const baseNameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

const baseEmailSchema = z.email("Please enter a valid email address");

const baseSubjectSchema = z
  .string()
  .min(1, "Subject is required")
  .min(5, "Subject must be at least 5 characters")
  .max(100, "Subject must be less than 100 characters");

const baseMessageSchema = z
  .string()
  .min(1, "Message is required")
  .min(10, "Message must be at least 10 characters")
  .max(1000, "Message must be less than 1000 characters");

export const contactFormSchema = z.object({
  name: baseNameSchema,
  email: baseEmailSchema,
  subject: baseSubjectSchema,
  message: baseMessageSchema,
});

export const resumeRequestSchema = z.object({
  name: baseNameSchema,
  email: baseEmailSchema,
  company: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, "Company must be at least 2 characters")
    .refine((val) => !val || val.length <= 100, "Company must be less than 100 characters"),
});

export const blogSearchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(100, "Query too long"),
  page: z.number().min(1, "Page must be at least 1").optional().default(1),
  limit: z.number().min(1, "Limit must be at least 1").max(50, "Limit too high").optional().default(10),
});

export const projectFilterSchema = z.object({
  search: z.string().optional(),
  stacks: z.array(z.string()).optional(),
  openSourceOnly: z.boolean().optional(),
  type: z.enum(["all", "personal", "client"]).optional().default("all"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ResumeRequestData = z.infer<typeof resumeRequestSchema>;
export type BlogSearchData = z.infer<typeof blogSearchSchema>;
export type ProjectFilterData = z.infer<typeof projectFilterSchema>;
