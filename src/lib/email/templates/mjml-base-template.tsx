import React from "react";
import {
  Mjml,
  MjmlHead,
  MjmlTitle,
  MjmlAttributes,
  MjmlAll,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlDivider,
  MjmlButton,
  MjmlWrapper,
} from "mjml-react";
import { ITemplateConfig } from "../types";

// Simple MJML template that avoids file system issues
export const MjmlBaseTemplate: React.FC<IMjmlBaseTemplateProps> = ({
  title,
  children,
  templateConfig,
  showSocialLinks = true,
}) => {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlTitle>{title}</MjmlTitle>
        <MjmlAttributes>
          <MjmlAll fontFamily="Arial, Helvetica, sans-serif" />
          <MjmlText fontSize="16px" lineHeight="24px" color="#ffffff" />
        </MjmlAttributes>
      </MjmlHead>
      <MjmlBody backgroundColor="#121212" width={600}>
        {/* Header */}
        <MjmlSection backgroundColor="#111111" padding="0">
          <MjmlColumn>
            <MjmlText align="center" fontSize="24px" fontWeight={700} color="#ff5f1f" padding="25px 20px">
              {title}
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>

        {/* Main Content */}
        <MjmlSection backgroundColor="#1e1e1e" padding="30px 25px">
          <MjmlColumn>{children}</MjmlColumn>
        </MjmlSection>

        {/* Footer */}
        <MjmlSection backgroundColor="#111111" padding="25px">
          <MjmlColumn>
            {showSocialLinks && (
              <MjmlText align="center" color="#b0b0b0" fontSize="14px" paddingBottom="15px">
                <a
                  href={templateConfig.socialLinks.github}
                  style={{ color: "#b0b0b0", textDecoration: "none", margin: "0 10px" }}
                >
                  GitHub
                </a>
                {" | "}
                <a
                  href={templateConfig.socialLinks.linkedin}
                  style={{ color: "#b0b0b0", textDecoration: "none", margin: "0 10px" }}
                >
                  LinkedIn
                </a>
                {" | "}
                <a
                  href={templateConfig.companyWebsite}
                  style={{ color: "#b0b0b0", textDecoration: "none", margin: "0 10px" }}
                >
                  Website
                </a>
              </MjmlText>
            )}
            <MjmlText align="center" color="#808080" fontSize="12px">
              This is an automated message. Please don&apos;t reply to this email.
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  );
};

export interface IMjmlBaseTemplateProps {
  title: string;
  children: React.ReactNode;
  templateConfig: ITemplateConfig;
  showSocialLinks?: boolean;
}

// Utility components for common email elements
export const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <MjmlText paddingBottom="15px" color="#ffffff">
    <span style={{ color: "#ff5f1f", fontWeight: "bold" }}>{label}:</span> {value}
  </MjmlText>
);

export const MessageBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MjmlWrapper backgroundColor="#2a2a2a" border="1px solid #333333" borderRadius="4px" padding="20px">
    <MjmlText color="#ffffff" fontSize="16px" lineHeight="24px">
      {children}
    </MjmlText>
  </MjmlWrapper>
);

export const Divider: React.FC = () => <MjmlDivider borderColor="#333333" borderWidth="1px" padding="20px 0" />;

export const CallToActionButton: React.FC<{ text: string; url: string }> = ({ text, url }) => (
  <MjmlButton
    backgroundColor="#ff5f1f"
    color="#ffffff"
    fontSize="16px"
    fontWeight="bold"
    href={url}
    padding="12px 24px"
    borderRadius="4px"
    border="1px solid #ff5f1f"
    textDecoration="none"
    align="center"
  >
    {text}
  </MjmlButton>
);

export const Timestamp: React.FC = () => (
  <MjmlText align="right" fontSize="12px" color="#b0b0b0" paddingTop="20px">
    {new Date().toISOString()}
  </MjmlText>
);
