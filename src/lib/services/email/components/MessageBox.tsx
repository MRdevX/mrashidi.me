import { Section, Text } from "@react-email/components";

interface MessageBoxProps {
  label: string;
  message: string;
}

export function MessageBox({ label, message }: MessageBoxProps) {
  return (
    <Section style={messageBoxStyle}>
      <Text style={labelStyle}>{label}:</Text>
      <Text style={messageStyle}>
        {message.split("\n").map((line, index) => (
          <span key={`line-${index}-${line.slice(0, 10)}`}>
            {line}
            {index < message.split("\n").length - 1 && <br />}
          </span>
        ))}
      </Text>
    </Section>
  );
}

const messageBoxStyle = {
  backgroundColor: "#2a2a2a",
  border: "1px solid #333333",
  borderRadius: "4px",
  padding: "20px",
  marginTop: "20px",
};

const labelStyle = {
  color: "#ff5f1f",
  fontWeight: "bold",
  margin: "0 0 10px 0",
  fontSize: "14px",
};

const messageStyle = {
  margin: 0,
  fontSize: "14px",
  lineHeight: "1.5",
  whiteSpace: "pre-wrap" as const,
};
