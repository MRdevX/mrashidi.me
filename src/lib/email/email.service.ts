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
      socialLinks: {
        github: 'https://github.com/mrdevx',
        linkedin: 'https://linkedin.com/in/mrdevx',
      },
      footerText: 'Full Stack Developer specializing in Backend Development, Cloud & DevOps, and Database Design',
      skills: [
        { name: 'Backend Development', technologies: ['Node.js', 'TypeScript', 'Python', 'Go'] },
        { name: 'Cloud & DevOps', technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'] },
        { name: 'Database Design', technologies: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'] }
      ]
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
            Data: `Thanks for reaching out, ${data.name}! | ${this.templateConfig.companyName}`,
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
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for your message</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', Arial, sans-serif;
              line-height: 1.6;
              color: #f1f1f1;
              background-color: #000000;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #0a0a0a;
              border: 1px solid rgba(255, 95, 31, 0.2);
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(255, 95, 31, 0.15);
            }
            .email-header {
              background: linear-gradient(90deg, rgba(10,10,10,0.9) 0%, rgba(20,20,20,0.9) 50%, rgba(10,10,10,0.9) 100%), linear-gradient(180deg, #ff5f1f 0%, rgba(255, 95, 31, 0.8) 100%);
              padding: 30px 20px;
              text-align: center;
              border-bottom: 1px solid rgba(255, 95, 31, 0.3);
            }
            .email-header h1 {
              color: #ff5f1f;
              margin: 0;
              font-size: 24px;
              font-weight: 700;
              letter-spacing: 0.5px;
              text-shadow: 0 0 10px rgba(255, 95, 31, 0.5);
            }
            .email-body {
              padding: 30px 25px;
              background-color: rgba(15, 15, 15, 0.8);
            }
            .email-body p {
              margin: 0 0 20px;
              color: rgba(255, 255, 255, 0.9);
            }
            .message-box {
              background-color: rgba(30, 30, 30, 0.6);
              border: 1px solid rgba(255, 95, 31, 0.2);
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              white-space: pre-line;
              color: rgba(255, 255, 255, 0.8);
            }
            .cta-button {
              display: inline-block;
              background-color: #ff5f1f;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              text-align: center;
              transition: background-color 0.3s;
            }
            .cta-button:hover {
              background-color: #e65518;
            }
            .divider {
              height: 1px;
              background: linear-gradient(90deg, rgba(255, 95, 31, 0.01), rgba(255, 95, 31, 0.3), rgba(255, 95, 31, 0.01));
              margin: 25px 0;
            }
            .email-footer {
              background-color: rgba(10, 10, 10, 0.95);
              padding: 25px;
              text-align: center;
              border-top: 1px solid rgba(255, 95, 31, 0.2);
            }
            .social-links {
              margin: 15px 0;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              text-decoration: none;
              color: rgba(255, 255, 255, 0.7);
              font-size: 14px;
            }
            .social-links a:hover {
              color: #ff5f1f;
            }
            .footnote {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.5);
              margin-top: 20px;
            }
            @media only screen and (max-width: 600px) {
              .email-container {
                width: 100%;
                border-radius: 0;
              }
              .email-header h1 {
                font-size: 20px;
              }
              .email-body {
                padding: 20px 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Message Received</h1>
            </div>
            <div class="email-body">
              <p>Hi ${data.name},</p>
              
              <p>Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.</p>
              
              <p>I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.</p>
              
              <div class="message-box">
                ${data.message}
              </div>
              
              <div class="divider"></div>
              
              <p>While you wait for my response, feel free to explore my portfolio.</p>
              
              <a href="${this.templateConfig.companyWebsite}" class="cta-button">Visit My Portfolio</a>
              
              <p>Best regards,<br>Mahdi Rashidi</p>
            </div>
            <div class="email-footer">
              <div class="social-links">
                <a href="${this.templateConfig.socialLinks.github}" target="_blank">GitHub</a> | 
                <a href="${this.templateConfig.socialLinks.linkedin}" target="_blank">LinkedIn</a> | 
                <a href="${this.templateConfig.companyWebsite}" target="_blank">Website</a>
              </div>
              <p class="footnote">This is an automated message. Please don't reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private createUserConfirmationText(data: IContactFormData): string {
    return `
Hi ${data.name},

Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.

I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.

YOUR MESSAGE:
${data.message}

While you wait for my response, feel free to explore my portfolio:
${this.templateConfig.companyWebsite}

Best regards,
Mahdi Rashidi

---
GitHub: ${this.templateConfig.socialLinks.github}
LinkedIn: ${this.templateConfig.socialLinks.linkedin}
Website: ${this.templateConfig.companyWebsite}

This is an automated message. Please don't reply to this email.
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