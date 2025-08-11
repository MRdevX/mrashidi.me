import React from "react";
import { render, MjmlText } from "mjml-react";
import { ResumeRequestData } from "@/types/forms";
import { ITemplateConfig } from "../types";
import { MjmlBaseTemplate, InfoRow, Divider, CallToActionButton, Timestamp } from "./mjml-base-template";

export class MjmlResumeTemplates {
  static createAdminNotificationHtml(data: ResumeRequestData, templateConfig: ITemplateConfig): string {
    try {
      const { html } = render(
        <MjmlBaseTemplate title="New Resume Request" templateConfig={templateConfig} showSocialLinks={false}>
          <InfoRow label="Name" value={data.name} />
          <InfoRow label="Email" value={data.email} />
          {data.company && <InfoRow label="Company" value={data.company} />}

          <Divider />

          <MjmlText paddingBottom="15px" color="#ffffff">
            Someone has downloaded your resume from your portfolio website.
          </MjmlText>

          <Timestamp />
        </MjmlBaseTemplate>,
        {
          validationLevel: "skip",
          keepComments: false,
          beautify: false,
          minify: false,
        }
      );

      return html;
    } catch (error) {
      console.error("MJML rendering failed:", error);
      // Return a simple HTML fallback
      return `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 20px;">
            <h2 style="color: #ff5f1f;">New Resume Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
            <p>Someone has downloaded your resume from your portfolio website.</p>
          </body>
        </html>
      `;
    }
  }

  static createUserConfirmationHtml(data: ResumeRequestData, templateConfig: ITemplateConfig): string {
    try {
      const { html } = render(
        <MjmlBaseTemplate title="Resume Request Confirmation" templateConfig={templateConfig}>
          <MjmlText paddingBottom="20px" color="#ffffff">
            Hi {data.name},
          </MjmlText>

          <MjmlText paddingBottom="16px" color="#ffffff">
            Thank you for your interest in my professional background! I hope you found my CV helpful.
          </MjmlText>

          <MjmlText paddingBottom="16px" color="#ffffff">
            I invite you to explore my portfolio website where you can find detailed information about my experience,
            projects, and skills. Feel free to reach out if you&apos;d like to discuss potential opportunities or have any
            questions.
          </MjmlText>

          <Divider />

          <MjmlText paddingBottom="20px" color="#ffffff">
            Please visit my portfolio to learn more about my work:
          </MjmlText>

          <MjmlText align="center" paddingBottom="25px">
            <CallToActionButton text="Visit My Portfolio" url={templateConfig.companyWebsite} />
          </MjmlText>

          <MjmlText paddingTop="10px" color="#ffffff">
            If you&apos;d like to get in touch or have any questions, feel free to reach out through the contact form on my
            website or via the contact information below. I&apos;m always open to discussing new opportunities!
          </MjmlText>

          <MjmlText paddingTop="16px" color="#ffffff">
            Best regards,
            <br />
            Mahdi Rashidi
          </MjmlText>
        </MjmlBaseTemplate>,
        {
          validationLevel: "skip",
          keepComments: false,
          beautify: false,
          minify: false,
        }
      );

      return html;
    } catch (error) {
      console.error("MJML rendering failed:", error);
      // Return a simple HTML fallback
      return `
        <html>
          <body style="font-family: Arial, sans-serif; background-color: #121212; color: #ffffff; padding: 20px;">
            <h2 style="color: #ff5f1f;">Resume Request Confirmation</h2>
            <p>Hi ${data.name},</p>
            <p>Thank you for your interest in my professional background! I hope you found my CV helpful.</p>
            <p>I invite you to explore my portfolio website where you can find detailed information about my experience, projects, and skills.</p>
            <p>Best regards,<br>Mahdi Rashidi</p>
          </body>
        </html>
      `;
    }
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
