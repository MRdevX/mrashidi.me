import { EmailService } from "./email";

class ServiceFactory {
  private emailService: EmailService | null = null;

  getEmailService(): EmailService {
    if (!this.emailService) {
      this.emailService = new EmailService();
    }
    return this.emailService;
  }

  reset(): void {
    this.emailService = null;
  }
}

export const serviceFactory = new ServiceFactory();

export const getEmailService = () => serviceFactory.getEmailService();
