import { Link, Section } from "@react-email/components";
import type { ReactNode } from "react";

interface CallToActionButtonProps {
  href: string;
  children: ReactNode;
}

export function CallToActionButton({ href, children }: CallToActionButtonProps) {
  return (
    <Section style={buttonContainerStyle}>
      <Link href={href} style={buttonStyle}>
        {children}
      </Link>
    </Section>
  );
}

const buttonContainerStyle = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#ff6b35",
  color: "#ffffff",
  padding: "16px 32px",
  textDecoration: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  boxShadow: "0 4px 6px -1px rgba(255, 107, 53, 0.3), 0 2px 4px -1px rgba(255, 107, 53, 0.2)",
  transition: "all 0.2s ease",
};
