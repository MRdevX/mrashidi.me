import { Section, Text } from "@react-email/components";

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
          // biome-ignore lint/suspicious/noArrayIndexKey: Lines can duplicate; index ensures unique keys for <br /> positioning
          <span key={`line-${line}-${index}`}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </Text>
    </Section>
  );
}

const messageBoxStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "24px",
  marginTop: "24px",
};

const labelStyle = {
  color: "#ff6b35",
  fontWeight: "600",
  margin: "0 0 12px 0",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const messageStyle = {
  margin: 0,
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#334155",
  whiteSpace: "pre-wrap" as const,
};
