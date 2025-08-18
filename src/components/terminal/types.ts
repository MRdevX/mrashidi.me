import { ReactElement } from "react";
import { AVAILABLE_COMMANDS } from "./constants";

export interface Command {
  input: string;
  output: string | ReactElement;
  timestamp: Date;
}

export type CommandType = keyof typeof AVAILABLE_COMMANDS;
