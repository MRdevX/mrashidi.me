import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { ContactFormData } from "@/lib/validation/schemas";
import { ResumeRequestData } from "@/lib/validation/schemas";
import { ContactTemplates, ResumeTemplates, getTemplateConfig } from "./templates";
import { logger } from "@/lib/utils/logger";
import { AuthenticationError } from "@/lib/errors";

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
      throw new AuthenticationError("Missing AWS credentials");
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

  async sendContactFormEmail(data: ContactFormData): Promise<boolean> {
    try {
      logger.info({ operation: "sendContactFormEmail", status: "started" });
      const adminEmailSuccess = await this.sendAdminNotification(data);
      const userEmailSuccess = await this.sendUserConfirmation(data);

      logger.info({
        operation: "sendContactFormEmail",
        status: "completed",
        adminEmailSuccess,
        userEmailSuccess,
      });

      return adminEmailSuccess && userEmailSuccess;
    } catch (error) {
      logger.error({
        operation: "sendContactFormEmail",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async sendResumeRequestEmail(data: ResumeRequestData): Promise<boolean> {
    try {
      logger.info({ operation: "sendResumeRequestEmail", status: "started" });
      const adminEmailSuccess = await this.sendResumeRequestNotification(data);
      const userEmailSuccess = await this.sendResumeToUser(data);

      logger.info({
        operation: "sendResumeRequestEmail",
        status: "completed",
        adminEmailSuccess,
        userEmailSuccess,
      });

      return adminEmailSuccess && userEmailSuccess;
    } catch (error) {
      logger.error({
        operation: "sendResumeRequestEmail",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  private async sendAdminNotification(data: ContactFormData): Promise<boolean> {
    try {
      logger.debug({
        operation: "sendAdminNotification",
        status: "preparing",
        fromEmail: this.fromEmail,
        toEmail: this.toEmail,
      });

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

      logger.debug({ operation: "sendAdminNotification", status: "sending" });
      const response = await this.sesClient.send(command);

      logger.info({
        operation: "sendAdminNotification",
        status: "success",
        messageId: response.MessageId,
      });

      return true;
    } catch (error) {
      logger.error({
        operation: "sendAdminNotification",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  private async sendUserConfirmation(data: ContactFormData): Promise<boolean> {
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
      logger.info({
        operation: "sendUserConfirmation",
        status: "success",
        messageId: response.MessageId,
      });
      return true;
    } catch (error) {
      logger.error({
        operation: "sendUserConfirmation",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
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
      logger.info({
        operation: "sendResumeRequestNotification",
        status: "success",
        messageId: response.MessageId,
      });
      return true;
    } catch (error) {
      logger.error({
        operation: "sendResumeRequestNotification",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
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
      logger.info({
        operation: "sendResumeToUser",
        status: "success",
        messageId: response.MessageId,
      });
      return true;
    } catch (error) {
      logger.error({
        operation: "sendResumeToUser",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}
