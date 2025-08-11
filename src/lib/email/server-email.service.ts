import { FormData as IContactFormData } from "@/types/forms";
import { ResumeRequestData } from "@/types/forms";

// Server-side only email service to avoid MJML processing during build
export class ServerEmailService {
  private static emailServiceInstance: {
    sendContactFormEmail: (data: IContactFormData) => Promise<boolean>;
    sendResumeRequestEmail: (data: ResumeRequestData) => Promise<boolean>;
  } | null = null;

  private static async getEmailService() {
    if (!this.emailServiceInstance) {
      // Dynamic import to avoid MJML processing during build
      const { EmailService } = await import("./email.service");
      this.emailServiceInstance = new EmailService();
    }
    return this.emailServiceInstance;
  }

  static async sendContactFormEmail(data: IContactFormData): Promise<boolean> {
    try {
      const emailService = await this.getEmailService();
      return await emailService.sendContactFormEmail(data);
    } catch (error) {
      console.error("Failed to send contact form email:", error);
      return false;
    }
  }

  static async sendResumeRequestEmail(data: ResumeRequestData): Promise<boolean> {
    try {
      const emailService = await this.getEmailService();
      return await emailService.sendResumeRequestEmail(data);
    } catch (error) {
      console.error("Failed to send resume request email:", error);
      return false;
    }
  }
}
