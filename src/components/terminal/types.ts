import type { ReactElement } from "react";
import type { AVAILABLE_COMMANDS } from "./constants";

export interface Command {
  input: string;
  output: string | ReactElement;
  timestamp: Date;
}

export type CommandType = keyof typeof AVAILABLE_COMMANDS;
