import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { FormData as IContactFormData } from "@/types/forms";
import { ResumeRequestData } from "@/types/forms";
import { ContactTemplates, ResumeTemplates, getTemplateConfig } from "./templates";

export class EmailService {
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly toEmail: string;
  private readonly templateConfig: ReturnType<typeof getTemplateConfig>;

  constructor() {
    const region = process.env.AWS_REGION || "eu-central-1";
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error("Missing AWS credentials");
    }

    this.sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.fromEmail = process.env.EMAIL_FROM_ADDRESS || "no-reply@mrashidi.me";
    this.toEmail = process.env.EMAIL_TO_ADDRESS || "contact@mrashidi.me";
    this.templateConfig = getTemplateConfig();
  }

  async sendContactFormEmail(data: IContactFormData): Promise<boolean> {
    try {
      console.log("Sending contact form emails...");
      const adminEmailSuccess = await this.sendAdminNotification(data);
      console.log("Admin email success:", adminEmailSuccess);
      const userEmailSuccess = await this.sendUserConfirmation(data);
      console.log("User email success:", userEmailSuccess);
      return adminEmailSuccess && userEmailSuccess;
    } catch (error) {
      console.error("Failed to send contact form emails:", error);
      return false;
    }
  }

  async sendResumeRequestEmail(data: ResumeRequestData): Promise<boolean> {
    try {
      console.log("Sending resume request emails...");
      const adminEmailSuccess = await this.sendResumeRequestNotification(data);
      console.log("Resume admin email success:", adminEmailSuccess);
      const userEmailSuccess = await this.sendResumeToUser(data);
      console.log("Resume user email success:", userEmailSuccess);
      return adminEmailSuccess && userEmailSuccess;
    } catch (error) {
      console.error("Failed to send resume request emails:", error);
      return false;
    }
  }

  private async sendAdminNotification(data: IContactFormData): Promise<boolean> {
    try {
      console.log("Preparing admin notification email...");
      console.log("From:", this.fromEmail);
      console.log("To:", this.toEmail);

      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [this.toEmail],
        },
        Message: {
          Subject: {
            Data: `Contact Form Submission from ${data.name}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: ContactTemplates.createAdminNotificationHtml(data, this.templateConfig),
              Charset: "UTF-8",
            },
            Text: {
              Data: ContactTemplates.createAdminNotificationText(data),
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: [data.email],
      });

      console.log("Sending admin notification...");
      const response = await this.sesClient.send(command);
      console.log(`Admin notification sent successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      return false;
    }
  }

  private async sendUserConfirmation(data: IContactFormData): Promise<boolean> {
    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [data.email],
        },
        Message: {
          Subject: {
            Data: `Thanks for reaching out, ${data.name}! | ${this.templateConfig.companyName}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: ContactTemplates.createUserConfirmationHtml(data, this.templateConfig),
              Charset: "UTF-8",
            },
            Text: {
              Data: ContactTemplates.createUserConfirmationText(data, this.templateConfig),
              Charset: "UTF-8",
            },
          },
        },
      });

      const response = await this.sesClient.send(command);
      console.log(`User confirmation sent successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error("Failed to send user confirmation:", error);
      return false;
    }
  }

  private async sendResumeRequestNotification(data: ResumeRequestData): Promise<boolean> {
    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [this.toEmail],
        },
        Message: {
          Subject: {
            Data: `Resume Request from ${data.name}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: ResumeTemplates.createAdminNotificationHtml(data, this.templateConfig),
              Charset: "UTF-8",
            },
            Text: {
              Data: ResumeTemplates.createAdminNotificationText(data),
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: [data.email],
      });

      const response = await this.sesClient.send(command);
      console.log(`Resume request notification sent successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error("Failed to send resume request notification:", error);
      return false;
    }
  }

  private async sendResumeToUser(data: ResumeRequestData): Promise<boolean> {
    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [data.email],
        },
        Message: {
          Subject: {
            Data: `Thanks for downloading my CV! Let's connect - ${this.templateConfig.companyName}`,
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: ResumeTemplates.createUserConfirmationHtml(data, this.templateConfig),
              Charset: "UTF-8",
            },
            Text: {
              Data: ResumeTemplates.createUserConfirmationText(data, this.templateConfig),
              Charset: "UTF-8",
            },
          },
        },
      });

      const response = await this.sesClient.send(command);
      console.log(`Resume confirmation sent to user successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error("Failed to send resume confirmation to user:", error);
      return false;
    }
  }
}
