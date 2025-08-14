import { z } from "zod";
import { contactFormSchema, resumeRequestSchema } from "./schemas";

const contactFormAPISchema = contactFormSchema.extend({
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
});

const resumeRequestAPISchema = resumeRequestSchema;

export const validateContactFormAPI = (data: unknown) => {
  return contactFormAPISchema.parse(data);
};

export const validateResumeRequestAPI = (data: unknown) => {
  return resumeRequestAPISchema.parse(data);
};
