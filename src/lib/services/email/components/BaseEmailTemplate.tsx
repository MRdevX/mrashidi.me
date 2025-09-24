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
          <Section style={headerStyle}>
            <Text style={titleStyle}>{title}</Text>
          </Section>

          <Section style={contentStyle}>{children}</Section>

          <Hr style={hrStyle} />

          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              <Link href={templateConfig.socialLinks.github} style={linkStyle}>
                GitHub
              </Link>
              {" | "}
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
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#121212",
  color: "#ffffff",
  margin: 0,
  padding: "20px",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#1e1e1e",
  borderRadius: "8px",
  overflow: "hidden",
};

const headerStyle = {
  backgroundColor: "#111111",
  padding: "25px",
  textAlign: "center" as const,
  borderBottom: "2px solid #ff5f1f",
};

const titleStyle = {
  margin: 0,
  color: "#ff5f1f",
  fontSize: "24px",
  fontWeight: "bold",
};

const contentStyle = {
  padding: "30px 25px",
};

const hrStyle = {
  border: "none",
  borderTop: "1px solid #333333",
  margin: "0",
};

const footerStyle = {
  backgroundColor: "#111111",
  padding: "25px",
  textAlign: "center" as const,
};

const footerTextStyle = {
  color: "#808080",
  fontSize: "12px",
  margin: "0 0 10px 0",
};

const footerSubTextStyle = {
  color: "#666666",
  fontSize: "11px",
  margin: "0",
};

const linkStyle = {
  color: "#ff5f1f",
  textDecoration: "none",
};
