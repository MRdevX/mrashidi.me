import { createElement, useCallback, useState } from "react";
import { isAskMrEnabled } from "@/features/ask-mr";
import { useContent } from "@/lib/content";
import { logger } from "@/lib/core";
import { AskCommandOutput } from "../AskCommandOutput";
import { handleCommand } from "../commandHandlers";
import { TERMINAL_CONSTANTS } from "../constants";
import type { Command, CommandType } from "../types";
import { isValidCommand, normalizeCommand, resolveQuestion } from "../utils";

export const useTerminal = () => {
  const content = useContent();
  const [commands, setCommands] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const getLoadingMessage = useCallback((command: CommandType): string => {
    switch (command) {
      case "blog":
        return "Loading blog posts from API...";
      case "help":
        return "Loading available commands...";
      case "skills":
        return "Analyzing skill tree...";
      case "projects":
        return "Fetching project data...";
      case "experience":
        return "Loading work experience...";
      case "achievements":
        return "Retrieving achievements...";
      case "contact":
        return "Loading contact information...";
      case "about":
        return "Loading profile data...";
      default:
        return "Processing command...";
    }
  }, []);

  const getExecutionDelay = useCallback((command: CommandType): number => {
    switch (command) {
      case "blog":
        return 800;
      case "help":
        return 150;
      case "skills":
        return 300;
      case "projects":
        return 400;
      case "experience":
        return 350;
      case "achievements":
        return 250;
      case "contact":
        return 200;
      case "about":
        return 180;
      case "clear":
        return 50;
      default:
        return 200;
    }
  }, []);

  const executeCommand = useCallback(
    async (cmd: string) => {
      // `ask <question>` (or a plain question) streams its own output, so it skips the simulated delay and loading text.
      const question = isAskMrEnabled() ? resolveQuestion(cmd) : null;
      if (question) {
        setCommands((prev) => [
          ...prev,
          { input: cmd, output: createElement(AskCommandOutput, { question }), timestamp: new Date() },
        ]);
        setCommandHistory((prev) => [...prev, cmd]);
        return;
      }

      if (!isValidCommand(cmd)) {
        setCommands((prev) => [
          ...prev,
          { input: cmd, output: TERMINAL_CONSTANTS.NOT_FOUND_MESSAGE, timestamp: new Date() },
        ]);
        setCommandHistory((prev) => [...prev, cmd]);
        return;
      }

      const command = normalizeCommand(cmd);
      const commandIndex = commands.length;

      setCommands((prev) => [
        ...prev,
        {
          input: cmd,
          output: getLoadingMessage(command),
          timestamp: new Date(),
        },
      ]);

      setIsExecuting(true);

      try {
        const executionDelay = getExecutionDelay(command);
        await new Promise((resolve) => setTimeout(resolve, executionDelay));

        const output = await handleCommand(command, content);

        setCommands((prev) => {
          const newCommands = [...prev];
          newCommands[commandIndex] = {
            ...newCommands[commandIndex],
            output,
          };
          return newCommands;
        });

        if (command === "clear") {
          setCommands([]);
        } else {
          setCommandHistory((prev) => [...prev, cmd]);
        }
      } catch (error) {
        logger.error({
          operation: "executeCommand",
          command,
          error: error instanceof Error ? error.message : String(error),
        });
        setCommands((prev) => {
          const newCommands = [...prev];
          newCommands[commandIndex] = {
            ...newCommands[commandIndex],
            output: TERMINAL_CONSTANTS.ERROR_MESSAGE,
          };
          return newCommands;
        });
      } finally {
        setIsExecuting(false);
      }
    },
    [commands.length, content, getExecutionDelay, getLoadingMessage]
  );

  const clearTerminal = useCallback(() => {
    setCommands([]);
  }, []);

  return {
    commands,
    commandHistory,
    isExecuting,
    executeCommand,
    clearTerminal,
  };
};
