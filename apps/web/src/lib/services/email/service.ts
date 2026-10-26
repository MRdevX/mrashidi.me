import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { getSiteContent } from "@/lib/content/server";
import { getEnv, getRequiredEnv, logger } from "@/lib/core";
import type { ContactFormData, ResumeRequestData } from "@/lib/validation";
import { getTemplateConfig } from "./config";
import { createEmailTemplate } from "./renderer";

export class EmailService {
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly toEmail: string;

  constructor() {
    const region = getEnv("AWS_REGION") || "eu-central-1";
    const accessKeyId = getRequiredEnv("AWS_ACCESS_KEY_ID");
    const secretAccessKey = getRequiredEnv("AWS_SECRET_ACCESS_KEY");

    this.sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.fromEmail = getEnv("EMAIL_FROM_ADDRESS") || "no-reply@mrashidi.me";
    this.toEmail = getEnv("EMAIL_TO_ADDRESS") || "contact@mrashidi.me";
  }

  async sendContactFormEmail(data: ContactFormData): Promise<boolean> {
    try {
      logger.info({ operation: "sendContactFormEmail", status: "started" });
      const templateConfig = await this.templateConfig();

      const adminSuccess = await this.sendEmail(
        this.toEmail,
        `Contact Form Submission from ${data.name}`,
        data,
        "contact-admin",
        templateConfig
      );

      const userSuccess = await this.sendEmail(
        data.email,
        `Thanks for reaching out, ${data.name}! | ${templateConfig.companyName}`,
        data,
        "contact-user",
        templateConfig
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
      const templateConfig = await this.templateConfig();

      const adminSuccess = await this.sendEmail(
        this.toEmail,
        `Resume Request from ${data.name}`,
        data,
        "resume-admin",
        templateConfig
      );

      const userSuccess = await this.sendEmail(
        data.email,
        `Thanks for downloading my CV! Let's connect - ${templateConfig.companyName}`,
        data,
        "resume-user",
        templateConfig
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

  private async templateConfig() {
    return getTemplateConfig((await getSiteContent()).profile);
  }

  private async sendEmail(
    to: string,
    subject: string,
    data: ContactFormData | ResumeRequestData,
    templateType: string,
    templateConfig: ReturnType<typeof getTemplateConfig>
  ): Promise<boolean> {
    try {
      const { html, text } = await createEmailTemplate(data, templateType, templateConfig);

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
