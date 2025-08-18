import { z } from "zod";
import { contactFormSchema, resumeRequestSchema } from "./schemas";

const contactFormAPISchema = contactFormSchema.extend({
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

export const validateContactFormAPI = (data: unknown) => contactFormAPISchema.parse(data);
export const validateResumeRequestAPI = (data: unknown) => resumeRequestSchema.parse(data);
