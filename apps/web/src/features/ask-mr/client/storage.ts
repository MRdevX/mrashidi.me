import type { AskMrUIMessage } from "../server/tools";

const MESSAGES_KEY = "ask-mr:messages";
const CONVERSATION_KEY = "ask-mr:conversation";

// sessionStorage can be missing or throw (private mode, blocked site data); the chat must work without it.
function read(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) {
      window.sessionStorage.removeItem(key);
    } else {
      window.sessionStorage.setItem(key, value);
    }
  } catch {
    // Ignore: persistence is a convenience only.
  }
}

export function loadMessages(): AskMrUIMessage[] {
  const raw = read(MESSAGES_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AskMrUIMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages: AskMrUIMessage[]): void {
  write(MESSAGES_KEY, messages.length ? JSON.stringify(messages) : null);
}

/** Random per-tab id that groups anonymous log entries; never tied to the visitor. */
export function getConversationId(): string {
  const existing = read(CONVERSATION_KEY);
  if (existing) {
    return existing;
  }
  const id = crypto.randomUUID();
  write(CONVERSATION_KEY, id);
  return id;
}

export function resetConversation(): string {
  write(MESSAGES_KEY, null);
  const id = crypto.randomUUID();
  write(CONVERSATION_KEY, id);
  return id;
}
