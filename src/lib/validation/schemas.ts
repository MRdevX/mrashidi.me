import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.email("Please enter a valid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

export const resumeRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.email("Please enter a valid email address"),
  company: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 2, "Company must be at least 2 characters")
    .refine((val) => !val || val.length <= 100, "Company must be less than 100 characters"),
});

export const blogSearchSchema = z.object({
  query: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, "Search query must be less than 100 characters"),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const projectFilterSchema = z.object({
  search: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, "Search query must be less than 100 characters"),
  category: z.string().optional(),
  technology: z.string().optional(),
  sortBy: z.enum(["name", "date", "category"]).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ResumeRequestData = z.infer<typeof resumeRequestSchema>;
export type BlogSearchData = z.infer<typeof blogSearchSchema>;
export type ProjectFilterData = z.infer<typeof projectFilterSchema>;
