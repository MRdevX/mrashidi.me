"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { SquarePen, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@/lib/content";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ASK_MR_NAME } from "../constants";
import { messageText } from "../messageText";
import { useAskMr } from "./AskMrProvider";
import { ChatMessage } from "./ChatMessage";
import { Composer } from "./Composer";
import { EmptyState } from "./EmptyState";
import { ErrorBanner } from "./ErrorBanner";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { useAskMrChat } from "./useAskMrChat";
import { useVisualViewportHeight } from "./useVisualViewportHeight";

const headerButton =
  "inline-flex size-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-brand-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-white/10 ";

export function AskMrPanel() {
  const { isOpen, close, pendingPrompt, consumePrompt } = useAskMr();
  const chat = useAskMrChat();
  const { profile } = useContent();
  const { messages, status, isBusy, parsedError, ask, reset, regenerate, stop, conversationId } = chat;

  const isDesktop = useMediaQuery("(min-width: 640px)", true);
  const viewportHeight = useVisualViewportHeight(!isDesktop && isOpen);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [sendKey, setSendKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const send = (text: string, suggested = false) => {
    ask(text, { suggested });
    setSendKey((k) => k + 1);
  };

  // Deferred like AskMrTerminalAnswer: a send from StrictMode's throwaway first mount would be aborted.
  useEffect(() => {
    if (!pendingPrompt) {
      return;
    }
    const timer = window.setTimeout(() => {
      consumePrompt(pendingPrompt.id);
      ask(pendingPrompt.text, { suggested: true });
      setSendKey((k) => k + 1);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pendingPrompt, consumePrompt, ask]);

  // Announce completed answers once, instead of every streamed token.
  const previousStatus = useRef(status);
  useEffect(() => {
    if (previousStatus.current === "streaming" && status === "ready") {
      const last = messages.at(-1);
      if (last?.role === "assistant") {
        setAnnouncement(`${ASK_MR_NAME} answered: ${messageText(last)}`);
      }
    }
    previousStatus.current = status;
  }, [status, messages]);

  const lastMessage = messages.at(-1);
  const waiting = status === "submitted" || (status === "streaming" && lastMessage?.role === "user");
  const contentKey = `${messages.length}:${lastMessage ? JSON.stringify(lastMessage.parts).length : 0}:${status}`;
  const onNavigate = () => {
    if (!isDesktop) {
      close();
    }
  };

  const statusLabel = status === "submitted" ? "Thinking…" : status === "streaming" ? "Answering…" : "Online";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()} modal={!isDesktop}>
      <Dialog.Portal>
        <Dialog.Content
          ref={contentRef}
          data-ask-mr
          aria-describedby="ask-mr-description"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            // Desktop: straight to typing. Mobile: don't pop the keyboard over the suggestions.
            (isDesktop ? inputRef.current : contentRef.current)?.focus();
          }}
          onInteractOutside={(event) => {
            // Desktop panel is non-modal: keep it open while the visitor browses the page.
            if (isDesktop) {
              event.preventDefault();
            }
          }}
          style={!isDesktop && viewportHeight ? { height: viewportHeight } : undefined}
          className={cn(
            "ask-mr-panel fixed z-[70] flex flex-col overflow-hidden bg-white/95 text-gray-900 shadow-2xl backdrop-blur-xl outline-none dark:bg-[hsl(222_14%_7%/0.96)] dark:text-gray-100",
            "inset-x-0 top-0 h-[100dvh]",
            "sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(680px,calc(100dvh-7rem))] sm:w-[420px] sm:rounded-2xl sm:border sm:border-primary/25 sm:shadow-[0_24px_64px_-16px_rgb(0_0_0/0.45),0_0_0_1px_hsl(var(--primary)/0.08),0_0_40px_-12px_hsl(var(--primary)/0.35)]"
          )}
        >
          <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-white/10">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Dialog.Title className="font-terminal text-base font-bold tracking-tight">
                <span className="text-brand-text">&gt;_</span> {ASK_MR_NAME}
              </Dialog.Title>
              <span className="rounded border border-primary/40 px-1 font-terminal text-[10px] font-semibold uppercase text-brand-text ">
                AI
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500" aria-live="polite">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isBusy ? "animate-pulse bg-primary motion-reduce:animate-none" : "bg-emerald-500"
                  )}
                  aria-hidden
                />
                {statusLabel}
              </span>
            </div>
            <button
              type="button"
              className={headerButton}
              onClick={() => {
                reset();
                inputRef.current?.focus();
              }}
              disabled={messages.length === 0}
              aria-label="Start a new chat"
              title="New chat"
            >
              <SquarePen className="size-4" aria-hidden />
            </button>
            <Dialog.Close
              className={headerButton}
              aria-label={`Close ${ASK_MR_NAME}`}
              title="Close (conversation is kept)"
            >
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </header>
          <Dialog.Description id="ask-mr-description" className="sr-only">
            An AI assistant that answers questions about {profile.person.name} from his published portfolio. Answers can
            be inaccurate.
          </Dialog.Description>

          <MessageList contentKey={contentKey} sendKey={sendKey}>
            {messages.length === 0 ? (
              <EmptyState onAsk={(question) => send(question, true)} />
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                  isStreaming={status === "streaming" && index === messages.length - 1}
                  isBusy={isBusy}
                  conversationId={conversationId}
                  onAsk={(question) => send(question, true)}
                  onRegenerate={() => void regenerate()}
                  onNavigate={onNavigate}
                  onMinimize={close}
                />
              ))
            )}
            {waiting ? <TypingIndicator /> : null}
            {parsedError ? (
              <ErrorBanner error={parsedError} onRetry={() => void regenerate()} onNavigate={onNavigate} />
            ) : null}
          </MessageList>

          <Composer
            inputRef={inputRef}
            isBusy={isBusy}
            disabled={parsedError?.code === "budget_exhausted" || parsedError?.code === "disabled"}
            onSend={(text) => send(text)}
            onStop={stop}
          />

          <p className="sr-only" aria-live="polite" aria-atomic>
            {announcement}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
