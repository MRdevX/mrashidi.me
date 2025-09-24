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
      <Head>
        <style>{darkModeStyles}</style>
      </Head>
      <Body style={bodyStyle} className="dark-mode-body">
        <Container style={containerStyle} className="dark-mode-container">
          {/* Header */}
          <Section style={headerStyle} className="dark-mode-header">
            <Text style={brandStyle} className="dark-mode-brand">
              {templateConfig.companyName}
            </Text>
            <Text style={titleStyle} className="dark-mode-title">
              {title}
            </Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle} className="dark-mode-content">
            {children}
          </Section>

          {/* Footer */}
          <Section style={footerStyle} className="dark-mode-footer">
            <Hr style={hrStyle} className="dark-mode-hr" />
            <Text style={footerTextStyle} className="dark-mode-footer-text">
              <Link href={templateConfig.socialLinks.github} style={linkStyle} className="dark-mode-link">
                GitHub
              </Link>
              {" • "}
              <Link href={templateConfig.socialLinks.linkedin} style={linkStyle} className="dark-mode-link">
                LinkedIn
              </Link>
            </Text>
            <Text style={footerSubTextStyle} className="dark-mode-subtext">
              {templateConfig.footerText}
            </Text>
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

const darkModeStyles = `
  @media (prefers-color-scheme: dark) {
    .dark-mode-body {
      background-color: #0f172a !important;
      color: #e2e8f0 !important;
    }
    
    .dark-mode-container {
      background-color: #1e293b !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2) !important;
    }
    
    .dark-mode-header {
      background-color: #1e293b !important;
      border-bottom-color: #334155 !important;
    }
    
    .dark-mode-content {
      background-color: #1e293b !important;
    }
    
    .dark-mode-footer {
      background-color: #0f172a !important;
    }
    
    .dark-mode-title {
      color: #f1f5f9 !important;
    }
    
    .dark-mode-text {
      color: #cbd5e1 !important;
    }
    
    .dark-mode-subtext {
      color: #94a3b8 !important;
    }
    
    .dark-mode-hr {
      border-top-color: #334155 !important;
    }
    
    .dark-mode-brand {
      color: #ff6b35 !important;
    }
    
    .dark-mode-icon {
      filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%) !important;
    }
    
    .dark-mode-button {
      background-color: #ff6b35 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 6px -1px rgba(255, 107, 53, 0.4), 0 2px 4px -1px rgba(255, 107, 53, 0.3) !important;
    }
    
    .dark-mode-message-box {
      background-color: #334155 !important;
      border-color: #475569 !important;
    }
    
    .dark-mode-label {
      color: #ff6b35 !important;
    }
    
    .dark-mode-message-text {
      color: #e2e8f0 !important;
    }
    
    .dark-mode-info-row {
      border-bottom-color: #334155 !important;
    }
    
    .dark-mode-info-label {
      color: #94a3b8 !important;
    }
    
    .dark-mode-info-value {
      color: #f1f5f9 !important;
    }
    
    .dark-mode-text {
      color: #cbd5e1 !important;
    }
    
    .dark-mode-footer-text {
      color: #94a3b8 !important;
    }
    
    .dark-mode-link {
      color: #ff6b35 !important;
    }
  }
`;
