"use client";

import dynamic from "next/dynamic";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { type AskMrOpenSource, trackAskMr } from "../client/analytics";
import { AskMrLauncher } from "./AskMrLauncher";

const AskMrPanel = dynamic(() => import("./AskMrPanel").then((m) => m.AskMrPanel), { ssr: false });
const AskMrCvRequest = dynamic(() => import("./AskMrCvRequest").then((m) => m.AskMrCvRequest), { ssr: false });

export interface AskMrOpenOptions {
  source: AskMrOpenSource;
  /** Sent immediately once the panel is ready (suggestion chips). */
  prompt?: string;
}

export interface PendingPrompt {
  id: number;
  text: string;
}

interface AskMrContextValue {
  enabled: boolean;
  isOpen: boolean;
  open: (options: AskMrOpenOptions) => void;
  close: () => void;
  pendingPrompt: PendingPrompt | null;
  consumePrompt: (id: number) => void;
  /** Minimizes the panel and opens the CV request form (rendered outside the panel so it isn't covered). */
  openCvRequest: () => void;
}

const AskMrContext = createContext<AskMrContextValue | null>(null);

export const isAskMrEnabled = () => process.env.NEXT_PUBLIC_ASK_MR_ENABLED !== "false";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.closest("[data-ask-mr]")) {
    return false;
  }
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function AskMrProvider({ children }: { children: ReactNode }) {
  const enabled = isAskMrEnabled();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<PendingPrompt | null>(null);
  const [cvRequestOpen, setCvRequestOpen] = useState(false);

  const open = useCallback(({ source, prompt }: AskMrOpenOptions) => {
    setIsOpen(true);
    setHasOpened(true);
    if (prompt?.trim()) {
      setPendingPrompt({ id: Date.now(), text: prompt.trim() });
    }
    trackAskMr("ask_mr_open", { source });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const openCvRequest = useCallback(() => {
    setIsOpen(false);
    setCvRequestOpen(true);
  }, []);

  const consumePrompt = useCallback(
    (id: number) => setPendingPrompt((current) => (current?.id === id ? null : current)),
    []
  );

  // Lets global CSS react to the open panel (e.g. hiding third-party floating widgets on mobile).
  useEffect(() => {
    document.documentElement.toggleAttribute("data-ask-mr-open", isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }
      if (isEditableTarget(event.target)) {
        return;
      }
      event.preventDefault();
      if (isOpen) {
        setIsOpen(false);
      } else {
        open({ source: "shortcut" });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, isOpen, open]);

  const value = useMemo(
    () => ({ enabled, isOpen, open, close, pendingPrompt, consumePrompt, openCvRequest }),
    [enabled, isOpen, open, close, pendingPrompt, consumePrompt, openCvRequest]
  );

  return (
    <AskMrContext.Provider value={value}>
      {children}
      {enabled ? (
        <>
          <AskMrLauncher />
          {/* Stays mounted after the first open so the conversation survives closing and navigation. */}
          {hasOpened ? <AskMrPanel /> : null}
          {cvRequestOpen ? <AskMrCvRequest onClose={() => setCvRequestOpen(false)} /> : null}
        </>
      ) : null}
    </AskMrContext.Provider>
  );
}

export function useAskMr(): AskMrContextValue {
  const context = useContext(AskMrContext);
  if (!context) {
    throw new Error("useAskMr must be used inside <AskMrProvider>");
  }
  return context;
}
