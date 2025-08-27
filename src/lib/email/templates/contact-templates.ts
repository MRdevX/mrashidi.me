import type { ContactFormData } from "@/lib/validation/schemas";
import type { ITemplateConfig } from "../types";
import {
  createButton,
  createInfoRow,
  createMessageBox,
  createTimestamp,
  formatMessage,
  getDividerElement,
  render,
} from "./base-template";

export function createAdminNotificationHtml(data: ContactFormData, templateConfig: ITemplateConfig): string {
  const content = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      ${createInfoRow("Name", data.name)}
      ${createInfoRow("Email", data.email)}
      ${createInfoRow("Subject", data.subject)}
    </table>
    
    ${getDividerElement()}
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding-bottom: 15px; color: #ffffff;">
          <span style="color: #ff5f1f; font-weight: bold;">Message:</span>
        </td>
      </tr>
      <tr>
        <td style="background-color: #2a2a2a; border: 1px solid #333333; border-radius: 4px; padding: 15px; color: #ffffff;">
          ${formatMessage(data.message)}
        </td>
      </tr>
    </table>
    
    ${createTimestamp()}
  `;

  return render({
    title: "New Contact Form Submission",
    content,
    showSocialLinks: false,
    templateConfig,
  });
}

export function createUserConfirmationHtml(data: ContactFormData, templateConfig: ITemplateConfig): string {
  const content = `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding-bottom: 20px; color: #ffffff;">
          <p style="margin: 0 0 16px 0; color: #ffffff;">Hi ${data.name},</p>
          
          <p style="margin: 0 0 16px 0; color: #ffffff;">Thank you for reaching out! I've received your message about "${
            data.subject
          }" and wanted to confirm that it's safely in my inbox.</p>
          
          <p style="margin: 0 0 16px 0; color: #ffffff;">I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.</p>
        </td>
      </tr>
    </table>
    
    ${createMessageBox(data.message)}
    
    ${getDividerElement()}
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="padding-bottom: 20px;">
          <p style="margin: 0 0 20px 0; color: #ffffff;">While you wait for my response, feel free to explore my portfolio.</p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding-bottom: 25px;">
          ${createButton("Visit My Portfolio", templateConfig.companyWebsite)}
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="margin: 0; color: #ffffff;">Best regards,<br>Mahdi Rashidi</p>
        </td>
      </tr>
    </table>
  `;

  return render({
    title: "Message Received",
    content,
    templateConfig,
  });
}

export function createAdminNotificationText(data: ContactFormData): string {
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

export function createUserConfirmationText(data: ContactFormData, templateConfig: ITemplateConfig): string {
  return `
Hi ${data.name},

Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.

I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.

YOUR MESSAGE:
${data.message}

While you wait for my response, feel free to explore my portfolio:
${templateConfig.companyWebsite}

Best regards,
Mahdi Rashidi

---
GitHub: ${templateConfig.socialLinks.github}
LinkedIn: ${templateConfig.socialLinks.linkedin}
Website: ${templateConfig.companyWebsite}

This is an automated message. Please don't reply to this email.
  `.trim();
}
