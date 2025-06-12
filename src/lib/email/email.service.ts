import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { IContactFormData, ITemplateConfig } from "./types";

export class EmailService {
  private readonly sesClient: SESClient;
  private readonly fromEmail: string;
  private readonly toEmail: string;
  private readonly templateConfig: ITemplateConfig;

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

    this.templateConfig = {
      companyName: "Mahdi Rashidi",
      companyWebsite: "https://mrashidi.me",
      socialLinks: {
        github: "https://github.com/mrdevx",
        linkedin: "https://linkedin.com/in/deerashidi",
      },
      footerText: "Software Backend Engineer specializing in Backend Development, Cloud & DevOps, and Database Design",
      skills: [
        { name: "Backend Development", technologies: ["Node.js", "TypeScript", "Python", "Go"] },
        { name: "Cloud & DevOps", technologies: ["AWS", "Docker", "Kubernetes", "Terraform"] },
        { name: "Database Design", technologies: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"] },
      ],
    };
  }

  async sendContactFormEmail(data: IContactFormData): Promise<boolean> {
    try {
      const adminEmailSuccess = await this.sendAdminNotification(data);
      const userEmailSuccess = await this.sendUserConfirmation(data);
      return adminEmailSuccess && userEmailSuccess;
    } catch (error) {
      console.error("Failed to send emails:", error);
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
            Charset: "UTF-8",
          },
          Body: {
            Html: {
              Data: this.createAdminEmailBody(data),
              Charset: "UTF-8",
            },
            Text: {
              Data: this.createAdminEmailText(data),
              Charset: "UTF-8",
            },
          },
        },
        ReplyToAddresses: [data.email],
      });

      const response = await this.sesClient.send(command);
      console.log(`Admin notification sent successfully: ${response.MessageId}`);
      return true;
    } catch (error) {
      console.error("Failed to send admin notification:", error);
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
              Data: this.createUserConfirmationHtml(data),
              Charset: "UTF-8",
            },
            Text: {
              Data: this.createUserConfirmationText(data),
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

  private createAdminEmailBody(data: IContactFormData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style type="text/css">
            body, p, div, td { 
              color: #ffffff;
              font-family: Arial, Helvetica, sans-serif;
            }
            body { 
              background-color: #121212; 
            }
            a { 
              color: #ff5f1f; 
              text-decoration: none; 
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #121212;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #1e1e1e; border-radius: 8px; border: 1px solid #333333; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding: 20px; background-color: #111111; border-bottom: 2px solid #ff5f1f; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ff5f1f;">New Contact Form Submission</h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 30px 25px; background-color: #1e1e1e;">
                      <!-- Contact details -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 15px; color: #ffffff;">
                            <span style="color: #ff5f1f; font-weight: bold;">Name:</span> ${data.name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 15px; color: #ffffff;">
                            <span style="color: #ff5f1f; font-weight: bold;">Email:</span> ${data.email}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom: 15px; color: #ffffff;">
                            <span style="color: #ff5f1f; font-weight: bold;">Subject:</span> ${data.subject}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
                        <tr>
                          <td height="1" style="background-color: #333333; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>
                      </table>
                      
                      <!-- Message section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 15px; color: #ffffff;">
                            <span style="color: #ff5f1f; font-weight: bold;">Message:</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #2a2a2a; border: 1px solid #333333; border-radius: 4px; padding: 15px; color: #ffffff;">
                            ${data.message.replace(/\n/g, "<br>")}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Timestamp -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
                        <tr>
                          <td align="right" style="font-size: 12px; color: #b0b0b0;">
                            Submitted at: ${new Date().toISOString()}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
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
          <style type="text/css">
            body, p, div, td { 
              color: #ffffff;
              font-family: Arial, Helvetica, sans-serif;
            }
            body { 
              background-color: #121212; 
            }
            a { 
              color: #ff5f1f; 
              text-decoration: none; 
            }
            p {
              margin: 0 0 16px 0;
              line-height: 1.5;
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #121212;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <!-- Email container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #1e1e1e; border-radius: 8px; border: 1px solid #333333; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding: 25px 20px; background-color: #111111; border-bottom: 2px solid #ff5f1f; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ff5f1f;">Message Received</h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 30px 25px; background-color: #1e1e1e;">
                      <!-- Greeting -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 20px; color: #ffffff;">
                            <p style="margin: 0 0 16px 0; color: #ffffff;">Hi ${data.name},</p>
                            
                            <p style="margin: 0 0 16px 0; color: #ffffff;">Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.</p>
                            
                            <p style="margin: 0 0 16px 0; color: #ffffff;">I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message box -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                        <tr>
                          <td style="background-color: #2a2a2a; border: 1px solid #333333; border-radius: 4px; padding: 20px; color: #ffffff;">
                            ${data.message.replace(/\n/g, "<br>")}
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Divider -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
                        <tr>
                          <td height="1" style="background-color: #333333; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>
                      </table>
                      
                      <!-- Call to action -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <p style="margin: 0 0 20px 0; color: #ffffff;">While you wait for my response, feel free to explore my portfolio.</p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding-bottom: 25px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                              <tr>
                                <td align="center" style="border-radius: 4px; background-color: #ff5f1f;">
                                  <a href="${this.templateConfig.companyWebsite}" target="_blank" style="display: inline-block; padding: 12px 24px; font-weight: bold; color: #ffffff; text-decoration: none; border: 1px solid #ff5f1f; border-radius: 4px;">Visit My Portfolio</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 10px;">
                            <p style="margin: 0; color: #ffffff;">Best regards,<br>Mahdi Rashidi</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 25px; background-color: #111111; border-top: 1px solid #333333; border-radius: 0 0 8px 8px;">
                      <!-- Social links -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
                        <tr>
                          <td align="center" style="color: #b0b0b0;">
                            <a href="${this.templateConfig.socialLinks.github}" target="_blank" style="color: #b0b0b0; text-decoration: none; margin: 0 10px;">GitHub</a> | 
                            <a href="${this.templateConfig.socialLinks.linkedin}" target="_blank" style="color: #b0b0b0; text-decoration: none; margin: 0 10px;">LinkedIn</a> | 
                            <a href="${this.templateConfig.companyWebsite}" target="_blank" style="color: #b0b0b0; text-decoration: none; margin: 0 10px;">Website</a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Footnote -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td align="center" style="color: #808080; font-size: 12px;">
                            This is an automated message. Please don't reply to this email.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
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
