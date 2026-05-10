import { Section, Text } from "@react-email/components";
import { emailTheme } from "../theme";

interface MessageBoxProps {
  label: string;
  message: string;
}

export function MessageBox({ label, message }: MessageBoxProps) {
  const lines = message.split("\n");

  return (
    <Section style={messageBoxStyle} className="dark-mode-message-box">
      <Text style={labelStyle} className="dark-mode-label">
        {label}
      </Text>
      <Text style={messageStyle} className="dark-mode-message-text">
        {lines.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Lines can duplicate; index ensures stable keys for <br /> insertion
          <span key={`line-${index}-${line.slice(0, 24)}`}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </Text>
    </Section>
  );
}

const messageBoxStyle = {
  backgroundColor: emailTheme.lightBg,
  border: `1px solid ${emailTheme.lightBorder}`,
  borderRadius: emailTheme.radiusMd,
  padding: "24px",
  marginTop: "24px",
};

const labelStyle = {
  color: emailTheme.primary,
  fontWeight: "600" as const,
  margin: "0 0 12px 0",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const messageStyle = {
  margin: "0",
  fontSize: "15px",
  lineHeight: "1.6",
  color: emailTheme.lightTextBody,
  whiteSpace: "pre-wrap" as const,
};
