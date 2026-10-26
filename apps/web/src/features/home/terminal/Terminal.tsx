"use client";

import { firstName } from "@mrashidi/types";
import { motion } from "framer-motion";
import React, { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { isAskMrEnabled } from "@/features/ask-mr";
import { useContent } from "@/lib/content";
import {
  aiWelcomeMessage,
  TERMINAL_COMMAND_CLICK_EVENT,
  TERMINAL_CONSTANTS,
  TERMINAL_STARTER_QUESTIONS,
  TERMINAL_STYLES,
} from "./constants";
import { useCommandHistory, useTerminal, useTerminalFocus } from "./hooks";
import { TerminalHistory } from "./TerminalHistory";
import { TerminalInput } from "./TerminalInput";

function TerminalWelcome({ aiEnabled }: { aiEnabled: boolean }) {
  const name = firstName(useContent().profile);

  if (!aiEnabled) {
    return <p className={TERMINAL_STYLES.WELCOME}>{TERMINAL_CONSTANTS.WELCOME_MESSAGE}</p>;
  }

  return (
    <div className="space-y-2">
      <p className={TERMINAL_STYLES.WELCOME}>{aiWelcomeMessage(name)}</p>
      <ul className="space-y-1" aria-label="Starter questions">
        {TERMINAL_STARTER_QUESTIONS.map((question) => (
          <li key={question}>
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-0 text-left text-green-600 transition-colors hover:underline dark:text-green-400 dark:hover:text-green-300"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(TERMINAL_COMMAND_CLICK_EVENT, { detail: { command: `ask ${question}`, run: true } })
                )
              }
            >
              <span className="text-gray-500 select-none">$ </span>ask {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const TerminalContainer = React.memo(() => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { commands, commandHistory, isExecuting, executeCommand } = useTerminal();
  const { navigateHistory, resetHistoryPosition } = useCommandHistory(commandHistory);
  const { terminalRef, handleTerminalClick } = useTerminalFocus(isExecuting, inputRef);
  const aiEnabled = isAskMrEnabled();

  useEffect(() => {
    // `run: true` executes the command right away (starter questions); otherwise it only fills the prompt.
    const handleCommandClick = (event: CustomEvent<{ command: string; run?: boolean }>) => {
      const { command, run } = event.detail;
      if (run) {
        executeCommand(command);
        return;
      }
      setInput(command);
      inputRef.current?.focus();
    };

    window.addEventListener(TERMINAL_COMMAND_CLICK_EVENT, handleCommandClick as EventListener);

    return () => {
      window.removeEventListener(TERMINAL_COMMAND_CLICK_EVENT, handleCommandClick as EventListener);
    };
  }, [executeCommand]);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && !isExecuting) {
      executeCommand(input);
      setInput("");
      resetHistoryPosition();
    } else if (e.key === "ArrowUp") {
      const newInput = navigateHistory("up", input);
      setInput(newInput);
    } else if (e.key === "ArrowDown") {
      const newInput = navigateHistory("down", input);
      setInput(newInput);
    }
  };

  return (
    <motion.div
      ref={terminalRef}
      className={TERMINAL_STYLES.CONTAINER}
      onClick={handleTerminalClick}
      role="application"
      aria-label="Interactive terminal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {commands.length === 0 && <TerminalWelcome aiEnabled={aiEnabled} />}
      <TerminalHistory commands={commands} />
      <TerminalInput
        inputRef={inputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isExecuting={isExecuting}
        placeholder={aiEnabled ? TERMINAL_CONSTANTS.AI_PLACEHOLDER : TERMINAL_CONSTANTS.DEFAULT_PLACEHOLDER}
      />
    </motion.div>
  );
});

TerminalContainer.displayName = "TerminalContainer";

export { TerminalContainer as Terminal };
