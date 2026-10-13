"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { projectHref } from "@/features/projects/infrastructure/projectDeepLink";
import { NewTabSrOnly } from "@/lib/a11y/new-tab-hint";
import { messageText } from "../messageText";
import { useAskMr } from "./AskMrProvider";
import { Markdown } from "./Markdown";
import { useAskMrChat } from "./useAskMrChat";

const linkClass = "text-green-600 hover:underline dark:text-green-400";

export function AskMrTerminalAnswer({ question }: { question: string }) {
  const chatId = useId();
  const { messages, status, parsedError, ask } = useAskMrChat({ persist: false, chatId: `terminal-${chatId}` });
  const { open } = useAskMr();
  const sent = useRef(false);

  // Deferred one tick and cancelled on cleanup: useChat stops in-flight requests on unmount, so a send from
  // StrictMode's throwaway first mount would be aborted. Only the mount that survives sends.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!sent.current) {
        sent.current = true;
        ask(question);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [ask, question]);

  const answer = messages.find((m) => m.role === "assistant");
  const streaming = status === "streaming";

  if (parsedError) {
    return <p className="mt-1 text-red-600 dark:text-red-400">ask-mr: {parsedError.message}</p>;
  }
  if (!answer || !messageText(answer)) {
    return <p className="mt-1 animate-pulse text-gray-500 motion-reduce:animate-none">ask-mr: thinking…</p>;
  }

  return (
    <div className="mt-1 space-y-2 font-mono text-gray-800 dark:text-gray-300" aria-live="off">
      {answer.parts.map((part, index) => {
        const key = `${answer.id}-${index}`;
        switch (part.type) {
          case "text":
            return <Markdown key={key} text={part.text} streaming={streaming} />;
          case "tool-showProjects":
            if (part.state !== "output-available") {
              return null;
            }
            return (
              <ul key={key} className="space-y-1">
                {part.output.projects.map((project) => (
                  <li key={project.slug}>
                    →{" "}
                    <Link href={projectHref(project.slug)} className={linkClass}>
                      {project.title}
                    </Link>{" "}
                    <span className="text-gray-500">[{project.stack.slice(0, 3).join(", ")}]</span>
                  </li>
                ))}
              </ul>
            );
          case "tool-contactHandoff":
            if (part.state !== "output-available") {
              return null;
            }
            return (
              <p key={key}>
                →{" "}
                <Link href={part.output.contactPath} className={linkClass}>
                  contact form
                </Link>{" "}
                ·{" "}
                <a href={`mailto:${part.output.email}`} className={linkClass}>
                  {part.output.email}
                </a>
              </p>
            );
          case "tool-requestCv":
            if (part.state !== "output-available") {
              return null;
            }
            return (
              <p key={key}>
                → request the CV at{" "}
                <Link href={part.output.resumePath} className={linkClass}>
                  /resume
                </Link>
              </p>
            );
          case "tool-getLatestPosts":
            if (part.state !== "output-available") {
              return null;
            }
            return (
              <ul key={key} className="space-y-1">
                {part.output.posts.map((post) => (
                  <li key={post.url}>
                    →{" "}
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {post.title}
                      <NewTabSrOnly />
                    </a>
                  </li>
                ))}
              </ul>
            );
          case "tool-suggestFollowUps":
            if (part.state !== "output-available") {
              return null;
            }
            return streaming ? null : (
              <p key={key} className="text-gray-500">
                try: {part.output.questions.map((q) => `ask ${q}`).join("  |  ")}
              </p>
            );
          default:
            return null;
        }
      })}
      {status === "ready" && (
        <button
          type="button"
          onClick={() => open({ source: "terminal" })}
          aria-haspopup="dialog"
          className="cursor-pointer border-none bg-transparent p-0 text-left text-gray-500 hover:text-green-600 hover:underline dark:hover:text-green-400"
        >
          → keep chatting in the Ask MR panel (⌘K)
        </button>
      )}
    </div>
  );
}
