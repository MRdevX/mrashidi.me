"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackAskMr } from "../client/analytics";
import { parseAskMrError } from "../client/errors";
import { getConversationId, loadMessages, resetConversation, saveMessages } from "../client/storage";
import type { AskMrUIMessage } from "../server/tools";

export interface UseAskMrChatOptions {
  /** Separate chats (e.g. the terminal) don't touch the panel's sessionStorage. */
  persist?: boolean;
  chatId?: string;
}

export function useAskMrChat({ persist = true, chatId = "ask-mr" }: UseAskMrChatOptions = {}) {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [conversationId, setConversationId] = useState(() => (persist ? getConversationId() : crypto.randomUUID()));
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;

  const initialMessages = useMemo(() => (persist ? loadMessages() : []), [persist]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<AskMrUIMessage>({
        api: "/api/chat",
        // Read refs at send time so navigation and "new chat" are reflected without recreating the chat.
        prepareSendMessagesRequest: ({ messages, body }) => ({
          body: { ...body, messages, conversationId: conversationIdRef.current, pathname: pathnameRef.current },
        }),
      }),
    []
  );

  const chat = useChat<AskMrUIMessage>({
    id: chatId,
    messages: initialMessages,
    transport,
    throttle: 50,
  });

  const { messages, setMessages, sendMessage, stop, clearError, status } = chat;

  useEffect(() => {
    if (persist && (status === "ready" || status === "error")) {
      saveMessages(messages);
    }
  }, [persist, messages, status]);

  const ask = useCallback(
    (text: string, { suggested = false }: { suggested?: boolean } = {}) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }
      clearError();
      trackAskMr("ask_mr_send", { suggested });
      void sendMessage({ text: trimmed });
    },
    [sendMessage, clearError]
  );

  const reset = useCallback(() => {
    stop();
    clearError();
    setMessages([]);
    setConversationId(persist ? resetConversation() : crypto.randomUUID());
  }, [stop, clearError, setMessages, persist]);

  return {
    ...chat,
    ask,
    reset,
    conversationId,
    parsedError: parseAskMrError(chat.error),
    isBusy: status === "submitted" || status === "streaming",
  };
}

export type AskMrChat = ReturnType<typeof useAskMrChat>;
