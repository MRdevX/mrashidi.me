export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

// API types
export interface ContactFormData extends FormData {
  recaptchaToken: string;
}

// Resume request types
export interface ResumeRequestData {
  name: string;
  email: string;
}

export interface ResumeRequestErrors {
  name?: string;
  email?: string;
}
