import { CommandType } from "./types";

export const formatTimestamp = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const normalizeCommand = (input: string): CommandType => {
  return input.toLowerCase().trim() as CommandType;
};

export const isValidCommand = (input: string): boolean => {
  const normalized = normalizeCommand(input);
  return normalized.length > 0;
};

export const generateCommandKey = (command: { timestamp: Date; input: string }, index: number): string => {
  return `${command.timestamp.getTime()}-${index}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};
