"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "./types";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <ContentContext value={content}>{children}</ContentContext>;
}

export function useContent(): SiteContent {
  const content = useContext(ContentContext);
  if (!content) {
    throw new Error("useContent must be used inside ContentProvider");
  }
  return content;
}
