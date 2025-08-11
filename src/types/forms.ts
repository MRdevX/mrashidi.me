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

export interface ContactFormData extends FormData {
  recaptchaToken: string;
}

export interface ResumeRequestData {
  name: string;
  email: string;
  company?: string;
}

export interface ResumeRequestErrors {
  name?: string;
  email?: string;
  company?: string;
}
