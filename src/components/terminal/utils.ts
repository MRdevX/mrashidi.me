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

export const isValidCommand = (input: string): boolean => {
  const normalized = normalizeCommand(input);
  return normalized in AVAILABLE_COMMANDS;
};

export const generateCommandKey = (command: { timestamp: Date; input: string }, index: number): string => {
  return `${command.timestamp.getTime()}-${command.input}-${index}`;
};

export { truncateText } from "@/lib/utils/index";
