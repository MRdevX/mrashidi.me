import { Text } from "@react-email/components";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Text style={infoRowStyle} className="dark-mode-info-row">
      <span style={labelStyle} className="dark-mode-info-label">
        {label}
      </span>
      <span style={valueStyle} className="dark-mode-info-value">
        {value}
      </span>
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
