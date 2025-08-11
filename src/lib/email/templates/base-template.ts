import { ITemplateConfig } from "../types";

export interface IBaseTemplateData {
  title: string;
  content: string;
  showSocialLinks?: boolean;
  templateConfig: ITemplateConfig;
}

export class BaseTemplate {
  private static getBaseStyles(): string {
    return `
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
    `;
  }

  private static getHeader(title: string): string {
    return `
      <tr>
        <td align="center" style="padding: 25px 20px; background-color: #111111; border-bottom: 2px solid #ff5f1f; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ff5f1f;">${title}</h1>
        </td>
      </tr>
    `;
  }

  private static getFooter(templateConfig: ITemplateConfig, showSocialLinks: boolean = true): string {
    const socialLinks = showSocialLinks
      ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 15px;">
        <tr>
          <td align="center" style="color: #b0b0b0;">
            <a href="${templateConfig.socialLinks.github}" target="_blank" style="color: #b0b0b0; text-decoration: none; margin: 0 10px;">GitHub</a> | 
            <a href="${templateConfig.socialLinks.linkedin}" target="_blank" style="color: #b0b0b0; text-decoration: none; margin: 0 10px;">LinkedIn</a> | 
            <a href="${templateConfig.companyWebsite}" target="_blank" style="color: #b0b0b0; text-decoration: none; margin: 0 10px;">Website</a>
          </td>
        </tr>
      </table>
    `
      : "";

    return `
      <tr>
        <td align="center" style="padding: 25px; background-color: #111111; border-top: 1px solid #333333; border-radius: 0 0 8px 8px;">
          ${socialLinks}
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="center" style="color: #808080; font-size: 12px;">
                This is an automated message. Please don't reply to this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `;
  }

  private static getDivider(): string {
    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
        <tr>
          <td height="1" style="background-color: #333333; font-size: 0; line-height: 0;">&nbsp;</td>
        </tr>
      </table>
    `;
  }

  static render(data: IBaseTemplateData): string {
    const { title, content, showSocialLinks = true, templateConfig } = data;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style type="text/css">
            ${this.getBaseStyles()}
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #121212;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #1e1e1e; border-radius: 8px; border: 1px solid #333333; box-shadow: 0 4px 16px rgba(0,0,0,0.5);">
                  ${this.getHeader(title)}
                  <tr>
                    <td style="padding: 30px 25px; background-color: #1e1e1e;">
                      ${content}
                    </td>
                  </tr>
                  ${this.getFooter(templateConfig, showSocialLinks)}
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  static getDividerElement(): string {
    return this.getDivider();
  }

  static formatMessage(message: string): string {
    return message.replace(/\n/g, "<br>");
  }

  static createMessageBox(content: string): string {
    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
        <tr>
          <td style="background-color: #2a2a2a; border: 1px solid #333333; border-radius: 4px; padding: 20px; color: #ffffff;">
            ${this.formatMessage(content)}
          </td>
        </tr>
      </table>
    `;
  }

  static createButton(text: string, url: string): string {
    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="border-radius: 4px; background-color: #ff5f1f;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; font-weight: bold; color: #ffffff; text-decoration: none; border: 1px solid #ff5f1f; border-radius: 4px;">${text}</a>
          </td>
        </tr>
      </table>
    `;
  }

  static createInfoRow(label: string, value: string): string {
    return `
      <tr>
        <td style="padding-bottom: 15px; color: #ffffff;">
          <span style="color: #ff5f1f; font-weight: bold;">${label}:</span> ${value}
        </td>
      </tr>
    `;
  }

  static createTimestamp(): string {
    return `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
        <tr>
          <td align="right" style="font-size: 12px; color: #b0b0b0;">
            ${new Date().toISOString()}
          </td>
        </tr>
      </table>
    `;
  }
}
