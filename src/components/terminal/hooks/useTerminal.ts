import { useState, useCallback } from "react";
import { Command, CommandType } from "../types";
import { handleCommand } from "../commandHandlers";
import { TERMINAL_CONSTANTS } from "../constants";
import { normalizeCommand, isValidCommand } from "../utils";

export const useTerminal = () => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCommand = useCallback(
    async (cmd: string) => {
      if (!isValidCommand(cmd)) return;

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

        const output = await handleCommand(command);

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
        console.error(`Error executing command ${command}:`, error);
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
    [commands.length]
  );

  const clearTerminal = useCallback(() => {
    setCommands([]);
  }, []);

  const getLoadingMessage = (command: CommandType): string => {
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
  };

  const getExecutionDelay = (command: CommandType): number => {
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
  };

  return {
    commands,
    commandHistory,
    isExecuting,
    executeCommand,
    clearTerminal,
  };
};
