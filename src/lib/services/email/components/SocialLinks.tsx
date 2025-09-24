import { Link, Section } from "@react-email/components";

interface SocialLinksProps {
  githubUrl: string;
  linkedinUrl: string;
}

export function SocialLinks({ githubUrl, linkedinUrl }: SocialLinksProps) {
  return (
    <Section style={socialLinksStyle}>
      <Link href={githubUrl} style={socialLinkStyle}>
        <img
          src="https://mrashidi.me/icons/github.svg"
          alt="GitHub"
          width="24"
          height="24"
          style={iconStyle}
          className="dark-mode-icon"
        />
      </Link>
      <Link href={linkedinUrl} style={socialLinkStyle}>
        <img
          src="https://mrashidi.me/icons/linkedin.svg"
          alt="LinkedIn"
          width="24"
          height="24"
          style={iconStyle}
          className="dark-mode-icon"
        />
      </Link>
    </Section>
  );
}

const socialLinksStyle = {
  textAlign: "center" as const,
  margin: "0 0 16px 0",
};

const socialLinkStyle = {
  display: "inline-block",
  margin: "0 12px",
  textDecoration: "none",
  transition: "opacity 0.2s ease",
};

const iconStyle = {
  display: "block",
  filter:
    "brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(1038%) hue-rotate(169deg) brightness(95%) contrast(87%)",
};
