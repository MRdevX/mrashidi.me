import { AVAILABLE_COMMANDS } from "./constants";
import type { CommandType } from "./types";

export const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const normalizeCommand = (input: string): CommandType => {
  return input.trim().toLowerCase() as CommandType;
};

/** Returns the question for `ask <question>`, or `null` when the input isn't an ask with a question. */
export const parseAskCommand = (input: string): string | null => {
  const match = input.trim().match(/^ask\s+(.+)$/is);
  return match ? match[1].trim() : null;
};

export const isValidCommand = (input: string): boolean => {
  const normalized = normalizeCommand(input);
  return normalized in AVAILABLE_COMMANDS || parseAskCommand(input) !== null;
};

export const generateCommandKey = (command: { timestamp: Date; input: string }, index: number): string => {
  return `${command.timestamp.getTime()}-${command.input}-${index}`;
};

export { truncateText } from "@/lib/utils/index";
