export * from "./terminal-data";
export * from "./terminal-hooks";

export const createMockCommand = (input: string, output: string, timestamp?: Date) => ({
  input,
  output,
  timestamp: timestamp || new Date("2024-01-15T14:30:45"),
});

export const createMockTerminalState = (overrides: Partial<any> = {}) => ({
  commands: [],
  commandHistory: [],
  isExecuting: false,
  ...overrides,
});
