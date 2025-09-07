import type { ITemplateConfig } from "../types";

export interface EmailTemplateData {
  name: string;
  email: string;
  subject?: string;
  message?: string;
  company?: string;
}

function createBaseTemplate(title: string, content: string, templateConfig: ITemplateConfig): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 8px; overflow: hidden; }
          .header { background-color: #111111; padding: 25px; text-align: center; border-bottom: 2px solid #ff5f1f; }
          .content { padding: 30px 25px; }
          .info-row { margin-bottom: 15px; }
          .label { color: #ff5f1f; font-weight: bold; }
          .message-box { background-color: #2a2a2a; border: 1px solid #333333; border-radius: 4px; padding: 20px; margin-top: 20px; }
          .button { display: inline-block; background-color: #ff5f1f; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { background-color: #111111; padding: 25px; text-align: center; color: #808080; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; color: #ff5f1f;">${title}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            GitHub: ${templateConfig.socialLinks.github} | LinkedIn: ${templateConfig.socialLinks.linkedin}
          </div>
        </div>
      </body>
    </html>
  `;
}

export function createEmailTemplate(
  data: EmailTemplateData,
  templateType: string,
  templateConfig: ITemplateConfig
): { html: string; text: string } {
  switch (templateType) {
    case "contact-admin":
      return createContactAdminTemplate(data, templateConfig);
    case "contact-user":
      return createContactUserTemplate(data, templateConfig);
    case "resume-admin":
      return createResumeAdminTemplate(data, templateConfig);
    case "resume-user":
      return createResumeUserTemplate(data, templateConfig);
    default:
      throw new Error(`Unknown template type: ${templateType}`);
  }
}

function createContactAdminTemplate(data: EmailTemplateData, templateConfig: ITemplateConfig) {
  const content = `
    <div class="info-row"><span class="label">Name:</span> ${data.name}</div>
    <div class="info-row"><span class="label">Email:</span> ${data.email}</div>
    <div class="info-row"><span class="label">Subject:</span> ${data.subject}</div>
    <div class="message-box">
      <div class="label">Message:</div>
      ${data.message?.replace(/\n/g, "<br>")}
    </div>
  `;

  const html = createBaseTemplate("New Contact Form Submission", content, templateConfig);

  const text = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Sent at: ${new Date().toISOString()}
  `.trim();

  return { html, text };
}

function createContactUserTemplate(data: EmailTemplateData, templateConfig: ITemplateConfig) {
  const content = `
    <p>Hi ${data.name},</p>
    <p>Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.</p>
    <p>I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.</p>
    <div style="text-align: center;">
      <a href="${templateConfig.companyWebsite}" class="button">Visit My Portfolio</a>
    </div>
    <p>Best regards,<br>Dee Rashidi</p>
  `;

  const html = createBaseTemplate("Message Received", content, templateConfig);

  const text = `
Hi ${data.name},

Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.

I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.

Visit my portfolio: ${templateConfig.companyWebsite}

Best regards,
Dee Rashidi

---
GitHub: ${templateConfig.socialLinks.github}
LinkedIn: ${templateConfig.socialLinks.linkedin}
  `.trim();

  return { html, text };
}

function createResumeAdminTemplate(data: EmailTemplateData, templateConfig: ITemplateConfig) {
  const content = `
    <div class="info-row"><span class="label">Name:</span> ${data.name}</div>
    <div class="info-row"><span class="label">Email:</span> ${data.email}</div>
    ${data.company ? `<div class="info-row"><span class="label">Company:</span> ${data.company}</div>` : ""}
    <p>Someone has downloaded your resume from your portfolio website.</p>
  `;

  const html = createBaseTemplate("New Resume Request", content, templateConfig);

  const text = `
New Resume Request

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ""}

Someone has downloaded your resume from your portfolio website.

Requested at: ${new Date().toISOString()}
  `.trim();

  return { html, text };
}

function createResumeUserTemplate(data: EmailTemplateData, templateConfig: ITemplateConfig) {
  const content = `
    <p>Hi ${data.name},</p>
    <p>Thank you for your interest in my professional background! I hope you found my CV helpful.</p>
    <p>I invite you to explore my portfolio website where you can find detailed information about my experience, projects, and skills.</p>
    <div style="text-align: center;">
      <a href="${templateConfig.companyWebsite}" class="button">Visit My Portfolio</a>
    </div>
    <p>If you'd like to get in touch or have any questions, feel free to reach out through the contact form on my website.</p>
    <p>Best regards,<br>Dee Rashidi</p>
  `;

  const html = createBaseTemplate("Resume Request Confirmation", content, templateConfig);

  const text = `
Hi ${data.name},

Thank you for your interest in my professional background! I hope you found my CV helpful.

I invite you to explore my portfolio website where you can find detailed information about my experience, projects, and skills.

Visit my portfolio: ${templateConfig.companyWebsite}

If you'd like to get in touch or have any questions, feel free to reach out through the contact form on my website.

Best regards,
Dee Rashidi

---
GitHub: ${templateConfig.socialLinks.github}
LinkedIn: ${templateConfig.socialLinks.linkedin}
  `.trim();

  return { html, text };
}
