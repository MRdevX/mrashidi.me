import { ContactFormData } from "@/types/forms";
import { ResumeRequestData } from "@/types/forms";

export class ContactFormValidator {
  static validate(data: unknown): ContactFormData {
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
    } else if (!this.isValidEmail(formData.email)) {
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
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class ResumeRequestValidator {
  static validate(data: unknown): ResumeRequestData {
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
    } else if (!this.isValidEmail(formData.email)) {
      errors.push("Invalid email format");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    return {
      name: formData.name!.trim(),
      email: formData.email!.trim().toLowerCase(),
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
