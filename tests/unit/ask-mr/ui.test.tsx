import { act, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AskMrUIMessage } from "@/features/ask-mr/server/tools";
import { ChatMessage } from "@/features/ask-mr/ui/ChatMessage";
import { Composer } from "@/features/ask-mr/ui/Composer";
import { ErrorBanner } from "@/features/ask-mr/ui/ErrorBanner";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
vi.mock("@/features/ask-mr/ui/AskMrProvider", () => ({ useAskMr: () => ({ openCvRequest: vi.fn() }) }));
// Streamdown is exercised in the browser; render plain text here to keep the unit tests fast and focused.
vi.mock("@/features/ask-mr/ui/Markdown", () => ({ Markdown: ({ text }: { text: string }) => <p>{text}</p> }));

const noop = () => undefined;

function assistant(parts: AskMrUIMessage["parts"]): AskMrUIMessage {
  return { id: "a1", role: "assistant", parts };
}

const baseProps = {
  isLast: true,
  isStreaming: false,
  isBusy: false,
  conversationId: "6f1c1f9e-8f39-4d61-9a6e-3b8f0f6c2d11",
  onAsk: noop,
  onRegenerate: noop,
  onNavigate: noop,
  onMinimize: noop,
};

describe("ChatMessage", () => {
  it("renders user messages as plain text", () => {
    render(
      <ChatMessage {...baseProps} message={{ id: "u1", role: "user", parts: [{ type: "text", text: "Hi <b>" }] }} />
    );
    expect(screen.getByText("Hi <b>")).toBeInTheDocument();
  });

  it("renders text, project cards, actions and follow-up chips", () => {
    const onAsk = vi.fn();
    render(
      <ChatMessage
        {...baseProps}
        onAsk={onAsk}
        message={assistant([
          { type: "text", text: "He led a migration.", state: "done" },
          {
            type: "tool-showProjects",
            toolCallId: "c1",
            state: "output-available",
            input: { slugs: ["x"] },
            output: {
              projects: [
                {
                  slug: "x",
                  title: "EV Fleet Platform",
                  description: "Fleet tools",
                  stack: ["NestJS"],
                  type: "client",
                },
              ],
            },
          },
          {
            type: "tool-suggestFollowUps",
            toolCallId: "c2",
            state: "output-available",
            input: { questions: ["What stack?"] },
            output: { questions: ["What stack?"] },
          },
        ])}
      />
    );

    expect(screen.getByText("He led a migration.")).toBeInTheDocument();
    expect(screen.getByText("EV Fleet Platform")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy answer" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Regenerate answer" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "What stack?" }));
    expect(onAsk).toHaveBeenCalledWith("What stack?");
  });

  it("hides actions and follow-ups while streaming", () => {
    render(
      <ChatMessage
        {...baseProps}
        isStreaming
        isBusy
        message={assistant([
          { type: "text", text: "Partial", state: "streaming" },
          {
            type: "tool-suggestFollowUps",
            toolCallId: "c2",
            state: "output-available",
            input: { questions: ["Next?"] },
            output: { questions: ["Next?"] },
          },
        ])}
      />
    );
    expect(screen.queryByRole("button", { name: "Copy answer" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next?" })).not.toBeInTheDocument();
  });

  it("only offers regenerate on the last answer", () => {
    render(
      <ChatMessage
        {...baseProps}
        isLast={false}
        message={assistant([{ type: "text", text: "Older answer", state: "done" }])}
      />
    );
    expect(screen.queryByRole("button", { name: "Regenerate answer" })).not.toBeInTheDocument();
  });
});

describe("Composer", () => {
  const setup = (props: Partial<Parameters<typeof Composer>[0]> = {}) => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    render(<Composer inputRef={createRef()} isBusy={false} onSend={onSend} onStop={onStop} {...props} />);
    return { onSend, onStop, input: screen.getByLabelText("Ask a question about Mahdi") };
  };

  it("sends on Enter and clears the draft", () => {
    const { onSend, input } = setup();
    fireEvent.change(input, { target: { value: "Has he used Kafka?" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("Has he used Kafka?");
    expect(input).toHaveValue("");
  });

  it("does not send on Shift+Enter or when empty", () => {
    const { onSend, input } = setup();
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "line" } });
    fireEvent.keyDown(input, { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("shows Stop instead of Send while busy", () => {
    const { onStop } = setup({ isBusy: true });
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stop generating" }));
    expect(onStop).toHaveBeenCalled();
  });

  it("hides voice input when the browser has no speech recognition", () => {
    setup();
    expect(screen.queryByRole("button", { name: "Dictate a question" })).not.toBeInTheDocument();
  });

  it("shows voice input when speech recognition exists", () => {
    (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition = class {};
    setup();
    expect(screen.getByRole("button", { name: "Dictate a question" })).toBeInTheDocument();
    delete (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  });
});

describe("ErrorBanner", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("counts down before allowing a retry when rate limited", () => {
    const onRetry = vi.fn();
    render(
      <ErrorBanner
        error={{ code: "rate_limited", message: "Slow down", retryAfter: 2 }}
        onRetry={onRetry}
        onNavigate={noop}
      />
    );
    expect(screen.getByText("Try again in 2s")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("offers contact instead of retry when the daily budget is used up", () => {
    render(<ErrorBanner error={{ code: "budget_exhausted", message: "Resting" }} onRetry={noop} onNavigate={noop} />);
    expect(screen.getByRole("link", { name: "Contact Mahdi" })).toHaveAttribute("href", "/contact");
    expect(screen.queryByRole("button", { name: "Retry" })).not.toBeInTheDocument();
  });
});
