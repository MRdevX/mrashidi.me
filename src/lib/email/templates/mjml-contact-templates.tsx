import React from "react";
import { render, MjmlText } from "mjml-react";
import { FormData as IContactFormData } from "@/types/forms";
import { ITemplateConfig } from "../types";
import { MjmlBaseTemplate, InfoRow, MessageBox, Divider, CallToActionButton, Timestamp } from "./mjml-base-template";

export class MjmlContactTemplates {
  static createAdminNotificationHtml(data: IContactFormData, templateConfig: ITemplateConfig): string {
    try {
      const { html } = render(
        <MjmlBaseTemplate title="New Contact Form Submission" templateConfig={templateConfig} showSocialLinks={false}>
          <InfoRow label="Name" value={data.name} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Subject" value={data.subject} />

          <Divider />

          <MjmlText paddingBottom="15px" color="#ffffff">
            <span style={{ color: "#ff5f1f", fontWeight: "bold" }}>Message:</span>
          </MjmlText>

          <MessageBox>
            {data.message.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < data.message.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </MessageBox>

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
            <h2 style="color: #ff5f1f;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message.replace(/\n/g, "<br>")}</p>
          </body>
        </html>
      `;
    }
  }

  static createUserConfirmationHtml(data: IContactFormData, templateConfig: ITemplateConfig): string {
    try {
      const { html } = render(
        <MjmlBaseTemplate title="Message Received" templateConfig={templateConfig}>
          <MjmlText paddingBottom="20px" color="#ffffff">
            Hi {data.name},
          </MjmlText>

          <MjmlText paddingBottom="16px" color="#ffffff">
            Thank you for reaching out! I&apos;ve received your message about &quot;{data.subject}&quot; and wanted to
            confirm that it&apos;s safely in my inbox.
          </MjmlText>

          <MjmlText paddingBottom="16px" color="#ffffff">
            I personally review every message and will get back to you as soon as possible, typically within 1-2 business
            days.
          </MjmlText>

          <MessageBox>
            {data.message.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < data.message.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </MessageBox>

          <Divider />

          <MjmlText paddingBottom="20px" color="#ffffff">
            While you wait for my response, feel free to explore my portfolio.
          </MjmlText>

          <MjmlText align="center" paddingBottom="25px">
            <CallToActionButton text="Visit My Portfolio" url={templateConfig.companyWebsite} />
          </MjmlText>

          <MjmlText paddingTop="10px" color="#ffffff">
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
            <h2 style="color: #ff5f1f;">Message Received</h2>
            <p>Hi ${data.name},</p>
            <p>Thank you for reaching out! I've received your message about "${data.subject}" and wanted to confirm that it's safely in my inbox.</p>
            <p>I personally review every message and will get back to you as soon as possible, typically within 1-2 business days.</p>
            <p><strong>Your Message:</strong></p>
            <p>${data.message.replace(/\n/g, "<br>")}</p>
            <p>Best regards,<br>Mahdi Rashidi</p>
          </body>
        </html>
      `;
    }
  }

  static createAdminNotificationText(data: IContactFormData): string {
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

  static createUserConfirmationText(data: IContactFormData, templateConfig: ITemplateConfig): string {
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
}
