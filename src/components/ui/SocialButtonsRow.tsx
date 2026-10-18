"use client";

import { Mail, Send } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getThemeConfig } from "@/config/theme.config";
import { config } from "@/data";
import { cn } from "@/lib/utils/common";
import { SocialButton } from "./SocialButton";

interface SocialButtonsRowProps {
  heading?: string;
  className?: string;
}

export function SocialButtonsRow({ heading, className }: SocialButtonsRowProps) {
  const { getTextColor } = getThemeConfig();

  return (
    <div className={cn("space-y-4", className)}>
      {heading ? (
        <p className={`${getTextColor("secondary")} text-center font-albert text-sm font-semibold tracking-wide`}>
          {heading}
        </p>
      ) : null}
      <div className="social-buttons-container">
        <SocialButton href={`mailto:${config.person.email}`} icon={Mail} isExternal={false}>
          Email
        </SocialButton>
        <SocialButton href={config.social.github} icon={FaGithub}>
          GitHub
        </SocialButton>
        <SocialButton href={config.social.linkedin} icon={FaLinkedin}>
          LinkedIn
        </SocialButton>
        <SocialButton href={config.social.telegram} icon={Send}>
          Telegram
        </SocialButton>
      </div>
    </div>
  );
}
