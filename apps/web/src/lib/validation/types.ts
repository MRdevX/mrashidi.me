import { ContactMessageSchema, CvRequestFormSchema } from "@mrashidi/types";
import { z } from "zod";

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

const recaptchaToken = z.string().min(1, "reCAPTCHA token is required").max(4096);

const contactFormAPISchema = ContactMessageSchema.extend({ recaptchaToken });
const resumeRequestAPISchema = CvRequestFormSchema.extend({ recaptchaToken });

export const validateContactFormAPI = (data: unknown) => contactFormAPISchema.parse(data);
export const validateResumeRequestAPI = (data: unknown) => resumeRequestAPISchema.parse(data);
