import { Link, Section } from "@react-email/components";
import type { ReactNode } from "react";
import { emailTheme } from "../theme";

interface CallToActionButtonProps {
  href: string;
  children: ReactNode;
}

export function CallToActionButton({ href, children }: CallToActionButtonProps) {
  return (
    <Section style={buttonContainerStyle}>
      <table style={tableStyle} role="presentation" cellPadding={0} cellSpacing={0}>
        <tbody>
          <tr>
            <td style={tdStyle}>
              <Link href={href} style={buttonStyle} className="dark-mode-button">
                {children}
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
}

const buttonContainerStyle = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const tableStyle = {
  margin: "0 auto",
  width: "auto",
};

const tdStyle = {
  textAlign: "center" as const,
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: emailTheme.primary,
  color: emailTheme.primaryForeground,
  padding: "16px 32px",
  textDecoration: "none",
  borderRadius: emailTheme.radiusMd,
  fontSize: "15px",
  fontWeight: "600" as const,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  boxShadow: `0 4px 6px -1px rgba(${emailTheme.primaryRgb}, 0.3), 0 2px 4px -1px rgba(${emailTheme.primaryRgb}, 0.2)`,
};
