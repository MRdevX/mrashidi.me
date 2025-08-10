export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
}

export class ContactFormValidator {
  static validate(data: unknown): ContactFormData {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid form data");
    }

    const formData = data as Partial<ContactFormData>;

    const requiredFields: (keyof ContactFormData)[] = ["name", "email", "subject", "message", "recaptchaToken"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email!)) {
      throw new Error("Invalid email format");
    }

    if (formData.name!.length < 2 || formData.name!.length > 100) {
      throw new Error("Name must be between 2 and 100 characters");
    }

    if (formData.subject!.length < 5 || formData.subject!.length > 200) {
      throw new Error("Subject must be between 5 and 200 characters");
    }

    if (formData.message!.length < 10 || formData.message!.length > 2000) {
      throw new Error("Message must be between 10 and 2000 characters");
    }

    return formData as ContactFormData;
  }
}
