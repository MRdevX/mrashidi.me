import { ContactFormData, ResumeRequestData } from "@/types/forms";
import { validators } from "./common";

export const validateContactFormAPI = (data: unknown): ContactFormData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid form data");
  }

  const formData = data as Partial<ContactFormData>;
  const errors: string[] = [];

  if (!formData.name?.trim()) {
    errors.push("Name is required");
  }

  if (!formData.email?.trim()) {
    errors.push("Email is required");
  } else if (!validators.email(formData.email)) {
    errors.push("Invalid email format");
  }

  if (!formData.subject?.trim()) {
    errors.push("Subject is required");
  }

  if (!formData.message?.trim()) {
    errors.push("Message is required");
  }

  if (!formData.recaptchaToken?.trim()) {
    errors.push("reCAPTCHA token is required");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    name: formData.name!.trim(),
    email: formData.email!.trim().toLowerCase(),
    subject: formData.subject!.trim(),
    message: formData.message!.trim(),
    recaptchaToken: formData.recaptchaToken!.trim(),
  };
};

export const validateResumeRequestAPI = (data: unknown): ResumeRequestData => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid form data");
  }

  const formData = data as Partial<ResumeRequestData>;
  const errors: string[] = [];

  if (!formData.name?.trim()) {
    errors.push("Name is required");
  }

  if (!formData.email?.trim()) {
    errors.push("Email is required");
  } else if (!validators.email(formData.email)) {
    errors.push("Invalid email format");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    name: formData.name!.trim(),
    email: formData.email!.trim().toLowerCase(),
    company: formData.company?.trim() || undefined,
  };
};
