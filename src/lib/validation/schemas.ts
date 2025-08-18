import { z } from "zod";

const baseNameSchema = z
  .string()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .trim()
  .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, "Name can only contain letters, spaces, hyphens, apostrophes, and periods")
  .refine((val) => !/\s{2,}/.test(val), "Name cannot contain multiple consecutive spaces")
  .refine(
    (val) => !/^[\s\-'\.]+|[\s\-'\.]+$/.test(val),
    "Name cannot start or end with spaces, hyphens, apostrophes, or periods"
  );

const baseEmailSchema = z
  .email("Please enter a valid email address")
  .max(254, "Email must be less than 254 characters")
  .trim()
  .toLowerCase();

const baseSubjectSchema = z
  .string()
  .min(1, "Subject is required")
  .min(5, "Subject must be at least 5 characters")
  .max(100, "Subject must be less than 100 characters")
  .trim()
  .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, "Subject can only contain letters, numbers, spaces, and basic punctuation")
  .refine((val) => !/\s{2,}/.test(val), "Subject cannot contain multiple consecutive spaces");

const baseMessageSchema = z
  .string()
  .min(1, "Message is required")
  .min(10, "Message must be at least 10 characters")
  .max(1000, "Message must be less than 1000 characters")
  .trim()
  .regex(/^[\x00-\x7F\s\-_.,!?()@#$%&*+=<>[\]{}|\\/:;"'`~]+$/, "Message contains invalid characters")
  .refine((val) => !/\s{3,}/.test(val), "Message cannot contain more than 2 consecutive spaces");

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
    .trim()
    .refine((val) => !val || val.length >= 2, "Company must be at least 2 characters")
    .refine((val) => !val || val.length <= 100, "Company must be less than 100 characters")
    .refine(
      (val) => !val || /^[a-zA-Z0-9\s\-_.,&()]+$/.test(val),
      "Company name can only contain letters, numbers, spaces, and basic punctuation"
    ),
});

const searchQuerySchema = z
  .string()
  .min(1, "Search query is required")
  .max(100, "Query too long")
  .trim()
  .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, "Search query contains invalid characters")
  .refine((val) => !/\s{2,}/.test(val), "Search query cannot contain multiple consecutive spaces");

export const blogSearchSchema = z.object({
  query: searchQuerySchema,
  page: z.number().min(1, "Page must be at least 1").optional().default(1),
  limit: z.number().min(1, "Limit must be at least 1").max(50, "Limit too high").optional().default(10),
});

const projectSearchSchema = z
  .string()
  .optional()
  .transform((val) => val?.trim() || "")
  .refine((val) => !val || /^[a-zA-Z0-9\s\-_.,!?()]+$/.test(val), "Search term contains invalid characters");

const stackSchema = z
  .string()
  .min(1, "Stack name is required")
  .max(50, "Stack name too long")
  .regex(/^[a-zA-Z0-9\-\_]+$/, "Stack name can only contain letters, numbers, hyphens, and underscores");

export const projectFilterSchema = z.object({
  search: projectSearchSchema,
  stacks: z.array(stackSchema).optional(),
  openSourceOnly: z.boolean().optional(),
  type: z.enum(["all", "personal", "client"]).optional().default("all"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ResumeRequestData = z.infer<typeof resumeRequestSchema>;
export type BlogSearchData = z.infer<typeof blogSearchSchema>;
export type ProjectFilterData = z.infer<typeof projectFilterSchema>;
