import { Text } from "@react-email/components";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Text style={infoRowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </Text>
  );
}

const infoRowStyle = {
  marginBottom: "16px",
  fontSize: "15px",
  lineHeight: "1.6",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "12px 0",
  borderBottom: "1px solid #f1f5f9",
};

const labelStyle = {
  color: "#64748b",
  fontWeight: "600",
  fontSize: "14px",
  minWidth: "80px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const valueStyle = {
  color: "#1e293b",
  fontWeight: "500",
  flex: 1,
  textAlign: "right" as const,
};
