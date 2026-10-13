"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ASK_MR_NAME } from "../constants";
import { useAskMr } from "./AskMrProvider";

const PULSE_KEY = "ask-mr:pulsed";

function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);
  return isMac;
}

/** Plays the attention pulse at most once per browser session. */
function useOncePerSession(): boolean {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(PULSE_KEY)) {
        window.sessionStorage.setItem(PULSE_KEY, "1");
        setPulse(true);
      }
    } catch {
      // No storage: skip the pulse rather than repeat it on every page.
    }
  }, []);
  return pulse;
}

export function AskMrLauncher() {
  const { isOpen, open } = useAskMr();
  const isMac = useIsMac();
  const pulse = useOncePerSession();

  return (
    <button
      type="button"
      onClick={() => open({ source: "launcher" })}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={`Open ${ASK_MR_NAME}, an AI assistant about Mahdi`}
      className={cn(
        "ask-mr-launcher fixed right-4 z-[60] inline-flex items-center gap-2 rounded-full border border-orange-500/50 bg-white/90 text-sm font-semibold text-gray-900 shadow-[0_8px_30px_-8px_rgb(0_0_0/0.35),0_0_24px_-6px_rgb(255_95_31/0.6)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:bg-gray-900/90 dark:text-white",
        "bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] size-12 justify-center sm:bottom-6 sm:right-6 sm:size-auto sm:px-4 sm:py-2.5",
        pulse && "ask-mr-launcher--pulse",
        isOpen && "pointer-events-none scale-90 opacity-0"
      )}
    >
      <Sparkles className="size-5 text-orange-500" aria-hidden />
      <span className="hidden font-terminal sm:inline">{ASK_MR_NAME}</span>
      <kbd className="hidden rounded border border-gray-300 px-1.5 font-terminal text-[10px] font-medium text-gray-500 lg:inline dark:border-white/20 dark:text-gray-400">
        {isMac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
