import type { ContactMessage } from "@mrashidi/types";

export type SubmitStatus = {
  type: "success" | "error" | null;
  message: string;
};

export async function submitContactForm(data: ContactMessage, recaptchaToken: string): Promise<SubmitStatus> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      recaptchaToken,
    }),
  });

  if (response.ok) {
    return { type: "success", message: "Message sent successfully! I'll get back to you soon." };
  }

  const errorData = await response.json();
  return { type: "error", message: errorData.message || "Failed to send message. Please try again." };
}
