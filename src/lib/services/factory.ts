import { EmailService } from "./email";
import { GitHubService } from "./github";

class ServiceFactory {
  private emailService: EmailService | null = null;
  private githubService: GitHubService | null = null;

  getEmailService(): EmailService {
    if (!this.emailService) {
      this.emailService = new EmailService();
    }
    return this.emailService;
  }

  getGitHubService(): GitHubService {
    if (!this.githubService) {
      this.githubService = new GitHubService();
    }
    return this.githubService;
  }

  reset(): void {
    this.emailService = null;
    this.githubService = null;
  }
}

export const serviceFactory = new ServiceFactory();

export const getEmailService = () => serviceFactory.getEmailService();
export const getGitHubService = () => serviceFactory.getGitHubService();
