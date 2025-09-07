export * from "./command-fixtures";
export * from "./component-fixtures";

export const createCommandFixture = (input: string, output: string, timestamp?: Date) => ({
  input,
  output,
  timestamp: timestamp || new Date("2024-01-15T14:30:45"),
});

export const createTerminalStateFixture = (overrides: any = {}) => ({
  commands: [],
  commandHistory: [],
  isExecuting: false,
  ...overrides,
});

export const createInputPropsFixture = (overrides: any = {}) => ({
  inputRef: { current: null },
  value: "",
  onChange: () => {},
  onKeyDown: () => {},
  isExecuting: false,
  ...overrides,
});

export const testScenarios = {
  basic: {
    validCommands: ["help", "about", "skills"],
    invalidCommands: ["invalid", "random", ""],
    commandHistory: ["help", "about"],
  },

  edgeCases: {
    emptyInput: "",
    whitespaceInput: "   ",
    longCommand: "a".repeat(100),
    specialChars: "help!@#$%^&*()",
  },

  stateTransitions: {
    idleToExecuting: { from: false, to: true },
    executingToIdle: { from: true, to: false },
    commandAdded: { before: [], after: ["help"] },
    historyUpdated: { before: [], after: ["help", "about"] },
  },

  errorScenarios: {
    invalidCommand: "invalid",
    networkError: "blog",
    timeoutError: "projects",
  },
} as const;
