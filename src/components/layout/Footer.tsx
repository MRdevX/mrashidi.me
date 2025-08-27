import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { personalInfo } from "@/data";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
  isEmail?: boolean;
}

function SocialLink({ href, icon, ariaLabel, isEmail = false }: SocialLinkProps) {
  return (
    <a
      href={href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noopener noreferrer"}
      className="social-link"
      aria-label={ariaLabel}
    >
      {icon}
    </a>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: personalInfo.social.github,
      icon: <FaGithub className="icon-size-lg" />,
      ariaLabel: `Visit ${personalInfo.name}'s GitHub Profile`,
    },
    {
      href: personalInfo.social.linkedin,
      icon: <FaLinkedin className="icon-size-lg" />,
      ariaLabel: `Visit ${personalInfo.name}'s LinkedIn Profile`,
    },
    {
      href: `mailto:${personalInfo.social.email}`,
      icon: <Mail className="icon-size-lg" />,
      ariaLabel: `Email ${personalInfo.name}`,
      isEmail: true,
    },
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-card">
          <p className="footer-copyright">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <div className="social-links-container">
            {socialLinks.map((link) => (
              <SocialLink key={link.ariaLabel} {...link} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
