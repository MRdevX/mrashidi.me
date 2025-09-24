import { Link, Section } from "@react-email/components";

interface CallToActionButtonProps {
  href: string;
  children: React.ReactNode;
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
  margin: "20px 0",
};

const buttonStyle = {
  display: "inline-block",
  backgroundColor: "#ff5f1f",
  color: "#ffffff",
  padding: "12px 24px",
  textDecoration: "none",
  borderRadius: "4px",
  fontSize: "14px",
  fontWeight: "bold",
};
