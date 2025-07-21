import { FormData, FormErrors } from "@/types/forms";

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
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
