"use client";

import { Coffee, Mail } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useContent } from "@/lib/content";
import { BUY_ME_A_COFFEE_ID } from "./BuyMeACoffeeWidget";

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
      aria-label={isEmail ? ariaLabel : `${ariaLabel} (opens in new tab)`}
    >
      {icon}
    </a>
  );
}

export function Footer() {
  const { profile } = useContent();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: profile.social.github,
      icon: <FaGithub className="size-6" aria-hidden />,
      ariaLabel: `Visit ${profile.person.name}'s GitHub Profile`,
    },
    {
      href: profile.social.linkedin,
      icon: <FaLinkedin className="size-6" aria-hidden />,
      ariaLabel: `Visit ${profile.person.name}'s LinkedIn Profile`,
    },
    {
      href: `mailto:${profile.person.email}`,
      icon: <Mail className="size-6" aria-hidden />,
      ariaLabel: `Email ${profile.person.name}`,
      isEmail: true,
    },
  ];

  return (
    <footer className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {socialLinks.map((link) => (
            <SocialLink key={link.ariaLabel} {...link} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground block text-center text-sm">
            © {currentYear} {profile.person.name}. All rights reserved.
          </span>
          <a
            href={`https://www.buymeacoffee.com/${BUY_ME_A_COFFEE_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs underline-offset-4 hover:underline duration-150"
          >
            <Coffee className="size-3.5" aria-hidden />
            Buy me a coffee
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <Link
            href="/privacy"
            className="text-muted-foreground hover:text-primary text-xs underline-offset-4 hover:underline duration-150"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
