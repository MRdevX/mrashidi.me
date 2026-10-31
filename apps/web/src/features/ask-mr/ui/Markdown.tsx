"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { type Components, Streamdown } from "streamdown";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { type SiteContent, useContent } from "@/lib/content";
import { createSafeLink } from "../client/links";

const createComponents = (content: SiteContent): Components => {
  const safeLink = createSafeLink(content);
  return {
    p: ({ children }) => <p className="leading-relaxed [&:not(:first-child)]:mt-2">{children}</p>,
    ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-brand-text">{children}</ul>,
    ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1 pl-5 marker:text-brand-text">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
    code: ({ children }) => (
      <code className="rounded bg-black/5 px-1 py-0.5 font-terminal text-[0.85em] dark:bg-white/10">{children}</code>
    ),
    a: ({ href, children }) => {
      const link = safeLink(href, typeof window === "undefined" ? "" : window.location.origin);
      if (!link) {
        return <span>{children}</span>;
      }
      const className =
        "font-medium text-brand-text underline decoration-primary/40 underline-offset-2 hover:decoration-primary ";
      return link.external ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
          <NewTabSrOnly />
        </a>
      ) : (
        <Link href={link.href} className={className}>
          {children}
        </Link>
      );
    },
  };
};

interface MarkdownProps {
  text: string;
  streaming: boolean;
}

export const Markdown = memo(function Markdown({ text, streaming }: MarkdownProps) {
  const content = useContent();
  const components = useMemo(() => createComponents(content), [content]);
  return (
    <Streamdown
      mode={streaming ? "streaming" : "static"}
      isAnimating={streaming}
      parseIncompleteMarkdown
      dir="auto"
      components={components}
      linkSafety={{ enabled: false }}
      controls={false}
      className="text-sm"
    >
      {text}
    </Streamdown>
  );
});
