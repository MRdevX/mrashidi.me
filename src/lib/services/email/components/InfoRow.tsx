import { Text } from "@react-email/components";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Text style={infoRowStyle}>
      <span style={labelStyle}>{label}:</span> {value}
    </Text>
  );
}

const infoRowStyle = {
  marginBottom: "15px",
  fontSize: "14px",
  lineHeight: "1.5",
};

const labelStyle = {
  color: "#ff5f1f",
  fontWeight: "bold",
};
