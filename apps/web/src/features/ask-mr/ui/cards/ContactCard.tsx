"use client";

import { firstName } from "@mrashidi/types";
import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { FaLinkedin, FaTelegram } from "react-icons/fa";
import { trackAskMr } from "@/features/ask-mr/client/analytics";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { useContent } from "@/lib/content";
import { CardShell, cardButtonClass } from "./CardShell";

interface ContactCardProps {
  contactPath: string;
  email: string;
  linkedin: string;
  telegram: string;
  onNavigate: () => void;
}

export function ContactCard({ contactPath, email, linkedin, telegram, onNavigate }: ContactCardProps) {
  const name = firstName(useContent().profile);
  const track = () => trackAskMr("ask_mr_tool_click", { tool: "contactHandoff" });

  return (
    <CardShell title={`Reach ${name} directly`}>
      <div className="flex flex-wrap gap-2">
        <Link
          href={contactPath}
          className={cardButtonClass}
          onClick={() => {
            track();
            onNavigate();
          }}
        >
          <MessageSquare className="size-4" aria-hidden />
          Contact form
        </Link>
        <a href={`mailto:${email}`} className={cardButtonClass} onClick={track}>
          <Mail className="size-4" aria-hidden />
          Email
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={cardButtonClass} onClick={track}>
          <FaLinkedin className="size-4" aria-hidden />
          LinkedIn
          <NewTabSrOnly />
        </a>
        <a href={telegram} target="_blank" rel="noopener noreferrer" className={cardButtonClass} onClick={track}>
          <FaTelegram className="size-4" aria-hidden />
          Telegram
          <NewTabSrOnly />
        </a>
      </div>
    </CardShell>
  );
}
