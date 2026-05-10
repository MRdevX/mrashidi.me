import { Text } from "@react-email/components";
import type { ReactNode } from "react";
import { emailTheme } from "../theme";

interface TextChildProps {
  children: ReactNode;
}

export function EmailGreeting({ children }: TextChildProps) {
  return (
    <Text style={greetingStyle} className="dark-mode-text">
      {children}
    </Text>
  );
}

export function EmailParagraph({ children }: TextChildProps) {
  return (
    <Text style={paragraphStyle} className="dark-mode-text">
      {children}
    </Text>
  );
}

export function EmailSignature({ children }: TextChildProps) {
  return (
    <Text style={signatureStyle} className="dark-mode-text">
      {children}
    </Text>
  );
}

const greetingStyle = {
  fontSize: "18px",
  fontWeight: "600" as const,
  color: emailTheme.lightTextTitle,
  marginBottom: "24px",
};

const paragraphStyle = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: emailTheme.lightTextParagraph,
  marginBottom: "20px",
};

const signatureStyle = {
  fontSize: "16px",
  color: emailTheme.lightTextParagraph,
  marginTop: "32px",
  lineHeight: "1.6",
};
