import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";
import { emailAlbertSansStylesheetHref, emailDarkModeStyles, emailTheme } from "../theme";
import type { ITemplateConfig } from "../types";

interface BaseEmailTemplateProps {
  title: string;
  preview: string;
  children: React.ReactNode;
  templateConfig: ITemplateConfig;
}

export function BaseEmailTemplate({ title, preview, children, templateConfig }: BaseEmailTemplateProps) {
  return (
    <Html lang="en">
      <Head>
        <meta content="light dark" name="color-scheme" />
        <meta content="light dark" name="supported-color-schemes" />
        <link href={emailAlbertSansStylesheetHref} rel="stylesheet" />
        <style>{emailDarkModeStyles()}</style>
      </Head>
      <Body className="dark-mode-body" data-ogsc="" style={bodyStyle}>
        <Preview>{preview}</Preview>
        <Container className="dark-mode-container" style={containerStyle}>
          <Section className="dark-mode-accent-line" style={accentLineStyle} />

          <Section className="dark-mode-header" style={headerStyle}>
            <Text className="dark-mode-brand" style={brandStyle}>
              {templateConfig.companyName}
            </Text>
            <Text className="dark-mode-title" style={titleStyle}>
              {title}
            </Text>
          </Section>

          <Section className="dark-mode-content" style={contentStyle}>
            {children}
          </Section>

          <Section className="dark-mode-footer" style={footerStyle}>
            <Hr className="dark-mode-hr" style={hrStyle} />
            <Text className="dark-mode-footer-text" style={footerTextStyle}>
              <Link className="dark-mode-link" href={templateConfig.socialLinks.github} style={linkStyle}>
                GitHub
              </Link>
              {" • "}
              <Link className="dark-mode-link" href={templateConfig.socialLinks.linkedin} style={linkStyle}>
                LinkedIn
              </Link>
              {" • "}
              <Link className="dark-mode-link" href={templateConfig.socialLinks.telegram} style={linkStyle}>
                Telegram
              </Link>
            </Text>
            <Text className="dark-mode-subtext" style={footerSubTextStyle}>
              {templateConfig.footerText}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const accentLineStyle = {
  margin: "0",
  padding: "0",
  height: "4px",
  backgroundColor: emailTheme.primary,
};

const bodyStyle = {
  fontFamily: emailTheme.fontStack,
  backgroundColor: emailTheme.lightBg,
  color: emailTheme.lightTextBody,
  margin: 0,
  padding: "20px",
  lineHeight: "1.6",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: emailTheme.lightCard,
  borderRadius: emailTheme.radiusLg,
  overflow: "hidden",
  boxShadow: emailTheme.shadowCard,
};

const headerStyle = {
  backgroundColor: emailTheme.lightCard,
  padding: "32px 32px 28px",
  textAlign: "center" as const,
  borderBottom: `1px solid ${emailTheme.lightBorder}`,
};

const brandStyle = {
  margin: "0 0 8px 0",
  color: emailTheme.primary,
  fontSize: "16px",
  fontWeight: "600" as const,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
};

const titleStyle = {
  margin: 0,
  color: emailTheme.lightTextTitle,
  fontSize: "28px",
  fontWeight: "700" as const,
  lineHeight: "1.2",
};

const contentStyle = {
  padding: "32px",
  backgroundColor: emailTheme.lightCard,
};

const hrStyle = {
  border: "none",
  borderTop: `1px solid ${emailTheme.lightBorder}`,
  margin: "0 0 24px 0",
};

const footerStyle = {
  backgroundColor: emailTheme.lightBg,
  padding: "32px",
  textAlign: "center" as const,
};

const footerTextStyle = {
  color: emailTheme.lightTextMuted,
  fontSize: "14px",
  margin: "0 0 12px 0",
  fontWeight: "500" as const,
};

const footerSubTextStyle = {
  color: emailTheme.lightTextSubtle,
  fontSize: "12px",
  margin: "0",
  lineHeight: "1.5",
};

const linkStyle = {
  color: emailTheme.primary,
  textDecoration: "none",
  fontWeight: "500" as const,
};
