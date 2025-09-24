import { Body, Container, Head, Hr, Html, Link, Section, Text } from "@react-email/components";
import type { ITemplateConfig } from "../types";

interface BaseEmailTemplateProps {
  title: string;
  children: React.ReactNode;
  templateConfig: ITemplateConfig;
}

export function BaseEmailTemplate({ title, children, templateConfig }: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Text style={brandStyle}>{templateConfig.companyName}</Text>
            <Text style={titleStyle}>{title}</Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>{children}</Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Hr style={hrStyle} />
            <Text style={footerTextStyle}>
              <Link href={templateConfig.socialLinks.github} style={linkStyle}>
                GitHub
              </Link>
              {" • "}
              <Link href={templateConfig.socialLinks.linkedin} style={linkStyle}>
                LinkedIn
              </Link>
            </Text>
            <Text style={footerSubTextStyle}>{templateConfig.footerText}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  backgroundColor: "#f8fafc",
  color: "#334155",
  margin: 0,
  padding: "20px",
  lineHeight: "1.6",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const headerStyle = {
  backgroundColor: "#ffffff",
  padding: "40px 32px 32px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e2e8f0",
};

const brandStyle = {
  margin: "0 0 8px 0",
  color: "#ff6b35",
  fontSize: "16px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
};

const titleStyle = {
  margin: 0,
  color: "#1e293b",
  fontSize: "28px",
  fontWeight: "700",
  lineHeight: "1.2",
};

const contentStyle = {
  padding: "32px",
  backgroundColor: "#ffffff",
};

const hrStyle = {
  border: "none",
  borderTop: "1px solid #e2e8f0",
  margin: "0 0 24px 0",
};

const footerStyle = {
  backgroundColor: "#f8fafc",
  padding: "32px",
  textAlign: "center" as const,
};

const footerTextStyle = {
  color: "#64748b",
  fontSize: "14px",
  margin: "0 0 12px 0",
  fontWeight: "500",
};

const footerSubTextStyle = {
  color: "#94a3b8",
  fontSize: "12px",
  margin: "0",
  lineHeight: "1.5",
};

const linkStyle = {
  color: "#ff6b35",
  textDecoration: "none",
  fontWeight: "500",
};
