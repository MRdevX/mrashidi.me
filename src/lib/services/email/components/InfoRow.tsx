import { Column, Row, Section, Text } from "@react-email/components";
import { emailTheme } from "../theme";

interface InfoRowProps {
  label: string;
  value: string;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <Section style={wrapperStyle}>
      <Row className="dark-mode-info-row" style={rowStyle}>
        <Column style={labelColumnStyle}>
          <Text style={labelTextStyle} className="dark-mode-info-label">
            {label}
          </Text>
        </Column>
        <Column align="right" style={valueColumnStyle}>
          <Text style={valueTextStyle} className="dark-mode-info-value">
            {value}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

const wrapperStyle = {
  marginBottom: "0",
  padding: "0",
};

const rowStyle = {
  borderBottom: `1px solid ${emailTheme.lightBorderMuted}`,
  padding: "12px 0",
  marginBottom: "0",
};

const labelColumnStyle = {
  width: "38%",
  verticalAlign: "top" as const,
  paddingRight: "16px",
};

const valueColumnStyle = {
  width: "62%",
  verticalAlign: "top" as const,
};

const labelTextStyle = {
  margin: "0",
  color: emailTheme.lightTextMuted,
  fontWeight: "600" as const,
  fontSize: "14px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const valueTextStyle = {
  margin: "0",
  color: emailTheme.lightTextTitle,
  fontWeight: "500" as const,
  fontSize: "15px",
  lineHeight: "1.6",
  textAlign: "right" as const,
};
