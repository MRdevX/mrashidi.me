import { FormData, ResumeRequestData } from "@/types/forms";
import { validators, createValidator } from "./common";

export const validateContactForm = createValidator<FormData>({
  name: [
    (value) => validators.required(value, "Name"),
    (value) => validators.minLength(value, 2, "Name"),
    (value) => validators.maxLength(value, 100, "Name"),
  ],
  email: [(value) => validators.email(value)],
  subject: [
    (value) => validators.required(value, "Subject"),
    (value) => validators.minLength(value, 5, "Subject"),
    (value) => validators.maxLength(value, 200, "Subject"),
  ],
  message: [
    (value) => validators.required(value, "Message"),
    (value) => validators.minLength(value, 10, "Message"),
    (value) => validators.maxLength(value, 2000, "Message"),
  ],
});

export const validateResumeRequest = createValidator<ResumeRequestData>({
  name: [
    (value) => validators.required(value, "Name"),
    (value) => validators.minLength(value, 2, "Name"),
    (value) => validators.maxLength(value, 100, "Name"),
  ],
  email: [(value) => validators.email(value)],
  company: [(value) => (value ? validators.maxLength(value, 100, "Company") : undefined)],
});

export const validateForm = (formData: FormData) => {
  return validateContactForm(formData);
};
