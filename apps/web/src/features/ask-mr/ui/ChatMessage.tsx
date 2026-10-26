"use client";

import { messageText } from "../messageText";
import type { AskMrUIMessage } from "../server/tools";
import { BlogPostsCard } from "./cards/BlogPostsCard";
import { CardSkeleton } from "./cards/CardShell";
import { ContactCard } from "./cards/ContactCard";
import { CvCard } from "./cards/CvCard";
import { ProjectCards } from "./cards/ProjectCards";
import { FollowUpChips } from "./FollowUpChips";
import { Markdown } from "./Markdown";
import { MessageActions } from "./MessageActions";

interface ChatMessageProps {
  message: AskMrUIMessage;
  isLast: boolean;
  isStreaming: boolean;
  isBusy: boolean;
  conversationId: string;
  onAsk: (question: string) => void;
  onRegenerate: () => void;
  onNavigate: () => void;
  /** Hides the panel (conversation kept) so an overlay like the project drawer isn't covered. */
  onMinimize: () => void;
}

export function ChatMessage({
  message,
  isLast,
  isStreaming,
  isBusy,
  conversationId,
  onAsk,
  onRegenerate,
  onNavigate,
  onMinimize,
}: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-orange-700 px-3.5 py-2 text-sm text-white shadow-sm">
          {messageText(message)}
        </p>
      </div>
    );
  }

  const text = messageText(message);
  const followUps = message.parts.flatMap((part) =>
    part.type === "tool-suggestFollowUps" && part.state === "output-available" ? part.output.questions : []
  );

  return (
    <div className="flex flex-col items-start">
      <div className="w-full max-w-[92%] text-gray-800 dark:text-gray-200">
        {message.parts.map((part, index) => {
          const key = `${message.id}-${index}`;
          switch (part.type) {
            case "text":
              return <Markdown key={key} text={part.text} streaming={isStreaming && part.state === "streaming"} />;
            case "tool-showProjects":
              return part.state === "output-available" ? (
                <ProjectCards key={key} projects={part.output.projects} onNavigate={onMinimize} />
              ) : part.state === "output-error" ? null : (
                <CardSkeleton key={key} label="Loading projects" />
              );
            case "tool-contactHandoff":
              return part.state === "output-available" ? (
                <ContactCard key={key} {...part.output} onNavigate={onNavigate} />
              ) : null;
            case "tool-requestCv":
              return part.state === "output-available" ? (
                <CvCard key={key} resumePath={part.output.resumePath} onNavigate={onNavigate} />
              ) : null;
            case "tool-getLatestPosts":
              return part.state === "output-available" ? (
                <BlogPostsCard key={key} posts={part.output.posts} onNavigate={onNavigate} />
              ) : part.state === "output-error" ? null : (
                <CardSkeleton key={key} label="Loading blog posts" />
              );
            default:
              return null;
          }
        })}
      </div>

      {!isStreaming && text ? (
        <MessageActions
          text={text}
          messageId={message.id}
          conversationId={conversationId}
          onRegenerate={isLast ? onRegenerate : undefined}
        />
      ) : null}

      {isLast && !isBusy ? (
        <FollowUpChips questions={followUps} onSelect={onAsk} label="Follow-up questions" className="mt-2" />
      ) : null}
    </div>
  );
}
