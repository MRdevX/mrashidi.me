import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { IContactFormData, ITemplateConfig } from './types';

export class EmailService {
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly toEmail: string;
  private readonly templateConfig: ITemplateConfig;

  constructor() {
    const region = process.env.AWS_REGION || 'eu-central-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Missing AWS credentials');
    }

    this.sesClient = new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.fromEmail = process.env.EMAIL_FROM_ADDRESS || 'no-reply@mrashidi.me';
    this.toEmail = process.env.EMAIL_TO_ADDRESS || 'contact@mrashidi.me';

    this.templateConfig = {
      companyName: 'Mahdi Rashidi',
      companyWebsite: 'https://mrashidi.me',
    };
  }

  async sendContactFormEmail(data: IContactFormData): Promise<boolean> {
    try {
      const adminEmailSuccess = await this.sendAdminNotification(data);
      const userEmailSuccess = await this.sendUserConfirmation(data);
      return adminEmailSuccess && userEmailSuccess;
    } catch (error) {
      console.error('Failed to send emails:', error);
      return false;
    }
  }

  private async sendAdminNotification(data: IContactFormData): Promise<boolean> {
    try {
      const command = new SendEmailCommand({
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [this.toEmail],
        },
        Message: {
          Subject: {
            Data: `Contact Form Submission from ${data.name}`,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: this.createAdminEmailBody(data),
              Charset: 'UTF-8',
            },
            Text: {
              Data: this.createAdminEmailText(data),
              Charset: 'UTF-8',
            },
          },
        },
        ReplyToAddresses: [data.email],
      });

      const response = await this.sesClient.send(command);
      console.log(`Admin notification sent successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error('Failed to send admin notification:', error);
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
            Data: `Thank you for contacting ${this.templateConfig.companyName}`,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: this.createUserConfirmationHtml(data),
              Charset: 'UTF-8',
            },
            Text: {
              Data: this.createUserConfirmationText(data),
              Charset: 'UTF-8',
            },
          },
        },
      });

      const response = await this.sesClient.send(command);
      console.log(`User confirmation sent successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error('Failed to send user confirmation:', error);
      return false;
    }
  }

  private createAdminEmailBody(data: IContactFormData): string {
    return `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>New Contact Form Submission</h1>
          <div>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          <div>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          </div>
          <div>
            <p>Submitted at: ${new Date().toISOString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  private createUserConfirmationHtml(data: IContactFormData): string {
    return `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Thank you for reaching out, ${data.name}!</h1>
          <p>We have received your message and appreciate you taking the time to contact us.</p>
          <p>Our team will review your message and get back to you as soon as possible.</p>
          <p>For your reference, here's what you sent us:</p>
          <blockquote>
            ${data.message}
          </blockquote>
          <p>
            <a href="${this.templateConfig.companyWebsite}">Visit Our Website</a>
          </p>
          <hr>
          <p>
            ${this.templateConfig.companyName}<br>
            This is an automated message, please do not reply to this email.
          </p>
        </body>
      </html>
    `;
  }

  private createUserConfirmationText(data: IContactFormData): string {
    return `
Thank you for reaching out, ${data.name}!

We have received your message and appreciate you taking the time to contact us.
Our team will review your message and get back to you as soon as possible.

For your reference, here's what you sent us:

${data.message}

Visit our website: ${this.templateConfig.companyWebsite}

${this.templateConfig.companyName}
This is an automated message, please do not reply to this email.
    `.trim();
  }

  private createAdminEmailText(data: IContactFormData): string {
    return `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Sent at: ${new Date().toISOString()}
    `.trim();
  }
} 