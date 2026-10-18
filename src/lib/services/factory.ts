import { EmailService } from "./email/service";

let emailService: EmailService | null = null;

export function getEmailService(): EmailService {
  emailService ??= new EmailService();
  return emailService;
}
