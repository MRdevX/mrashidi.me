import type { ResumeRequestData } from "@/lib/validation/schemas";
import type { ITemplateConfig } from "../types";
import { BaseTemplate } from "./base-template";

export class ResumeTemplates {
  static createAdminNotificationHtml(data: ResumeRequestData, templateConfig: ITemplateConfig): string {
    const content = `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        ${BaseTemplate.createInfoRow("Name", data.name)}
        ${BaseTemplate.createInfoRow("Email", data.email)}
        ${data.company ? BaseTemplate.createInfoRow("Company", data.company) : ""}
      </table>
      
      ${BaseTemplate.getDividerElement()}
      
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom: 15px; color: #ffffff;">
            <p style="margin: 0; color: #ffffff;">Someone has downloaded your resume from your portfolio website.</p>
          </td>
        </tr>
      </table>
      
      ${BaseTemplate.createTimestamp()}
    `;

    return BaseTemplate.render({
      title: "New Resume Request",
      content,
      showSocialLinks: false,
      templateConfig,
    });
  }

  static createUserConfirmationHtml(data: ResumeRequestData, templateConfig: ITemplateConfig): string {
    const content = `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom: 20px; color: #ffffff;">
            <p style="margin: 0 0 16px 0; color: #ffffff;">Hi ${data.name},</p>
            
            <p style="margin: 0 0 16px 0; color: #ffffff;">Thank you for your interest in my professional background! I hope you found my CV helpful.</p>
            
            <p style="margin: 0 0 16px 0; color: #ffffff;">I invite you to explore my portfolio website where you can find detailed information about my experience, projects, and skills. Feel free to reach out if you'd like to discuss potential opportunities or have any questions.</p>
          </td>
        </tr>
      </table>
      
      ${BaseTemplate.getDividerElement()}
      
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom: 20px;">
            <p style="margin: 0 0 20px 0; color: #ffffff;">Please visit my portfolio to learn more about my work:</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom: 25px;">
            ${BaseTemplate.createButton("Visit My Portfolio", templateConfig.companyWebsite)}
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px;">
            <p style="margin: 0 0 16px 0; color: #ffffff;">If you'd like to get in touch or have any questions, feel free to reach out through the contact form on my website or via the contact information below. I'm always open to discussing new opportunities!</p>
            <p style="margin: 0; color: #ffffff;">Best regards,<br>Mahdi Rashidi</p>
          </td>
        </tr>
      </table>
    `;

    return BaseTemplate.render({
      title: "Resume Request Confirmation",
      content,
      templateConfig,
    });
  }

  static createAdminNotificationText(data: ResumeRequestData): string {
    return `
New Resume Request

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ""}

Someone has downloaded your resume from your portfolio website.

Requested at: ${new Date().toISOString()}
    `.trim();
  }

  static createUserConfirmationText(data: ResumeRequestData, templateConfig: ITemplateConfig): string {
    return `
Hi ${data.name},

Thank you for your interest in my professional background! I hope you found my CV helpful.

I invite you to explore my portfolio website where you can find detailed information about my experience, projects, and skills. Feel free to reach out if you'd like to discuss potential opportunities or have any questions.

Please visit my portfolio to learn more about my work:
${templateConfig.companyWebsite}

If you'd like to get in touch or have any questions, feel free to reach out through the contact form on my website or via the contact information below. I'm always open to discussing new opportunities!

Best regards,
Mahdi Rashidi

---
GitHub: ${templateConfig.socialLinks.github}
LinkedIn: ${templateConfig.socialLinks.linkedin}
Website: ${templateConfig.companyWebsite}

This is an automated message. Please don't reply to this email.
    `.trim();
  }
}
