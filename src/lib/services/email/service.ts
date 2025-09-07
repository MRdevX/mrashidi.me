import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { logger } from "@/lib/core";
import { AuthenticationError } from "@/lib/errors";
import type { ContactFormData, ResumeRequestData } from "@/lib/validation";
import { getTemplateConfig } from "./config";
import { createEmailTemplate } from "./templates";

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

      const adminSuccess = await this.sendEmail(
        this.toEmail,
        `Contact Form Submission from ${data.name}`,
        data,
        "contact-admin"
      );

      const userSuccess = await this.sendEmail(
        data.email,
        `Thanks for reaching out, ${data.name}! | ${this.templateConfig.companyName}`,
        data,
        "contact-user"
      );

      logger.info({
        operation: "sendContactFormEmail",
        status: "completed",
        adminEmailSuccess: adminSuccess,
        userEmailSuccess: userSuccess,
      });

      return adminSuccess && userSuccess;
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

      const adminSuccess = await this.sendEmail(this.toEmail, `Resume Request from ${data.name}`, data, "resume-admin");

      const userSuccess = await this.sendEmail(
        data.email,
        `Thanks for downloading my CV! Let's connect - ${this.templateConfig.companyName}`,
        data,
        "resume-user"
      );

      logger.info({
        operation: "sendResumeRequestEmail",
        status: "completed",
        adminEmailSuccess: adminSuccess,
        userEmailSuccess: userSuccess,
      });

      return adminSuccess && userSuccess;
    } catch (error) {
      logger.error({
        operation: "sendResumeRequestEmail",
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  private async sendEmail(
    to: string,
    subject: string,
    data: ContactFormData | ResumeRequestData,
    templateType: string
  ): Promise<boolean> {
    try {
      const { html, text } = createEmailTemplate(data, templateType, this.templateConfig);

      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: html, Charset: "UTF-8" },
            Text: { Data: text, Charset: "UTF-8" },
          },
        },
        ...(templateType.includes("admin") && { ReplyToAddresses: [data.email] }),
      });

      const response = await this.sesClient.send(command);
      logger.info({
        operation: "sendEmail",
        templateType,
        messageId: response.MessageId,
      });
      return true;
    } catch (error) {
      logger.error({
        operation: "sendEmail",
        templateType,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}
