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

export const ContactMessageSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

export const CvRequestFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  company: z.string().trim().max(100, "Company must be less than 100 characters").optional(),
});

export const CvRequestSchema = CvRequestFormSchema.extend({
  cvUrl: z.url({ protocol: /^https?$/ }),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;
export type CvRequestForm = z.infer<typeof CvRequestFormSchema>;
export type CvRequest = z.infer<typeof CvRequestSchema>;
