import { FormData, FormErrors } from "@/types/forms";
import { isValidEmail } from "@/lib/utils";

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Subject validation
  if (!formData.subject.trim()) {
    errors.subject = "Subject is required";
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = "Message is required";
  } else if (formData.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters";
  }

  return errors;
};
