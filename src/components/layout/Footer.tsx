import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { config } from "@/data";

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
      className="text-muted-foreground hover:text-primary block duration-150"
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
      href: config.social.github,
      icon: <FaGithub className="size-6" />,
      ariaLabel: `Visit ${config.person.name}'s GitHub Profile`,
    },
    {
      href: config.social.linkedin,
      icon: <FaLinkedin className="size-6" />,
      ariaLabel: `Visit ${config.person.name}'s LinkedIn Profile`,
    },
    {
      href: `mailto:${config.person.email}`,
      icon: <Mail className="size-6" />,
      ariaLabel: `Email ${config.person.name}`,
      isEmail: true,
    },
  ];

  return (
    <footer className="py-8 md:py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {socialLinks.map((link) => (
            <SocialLink key={link.ariaLabel} {...link} />
          ))}
        </div>
        <span className="text-muted-foreground block text-center text-sm">
          © {currentYear} {config.person.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
