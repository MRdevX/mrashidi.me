import { vi } from "vitest";
import { mockCommandHistory, mockTerminalState } from "./terminal-data";

export const mockUseTerminal = vi.fn(() => ({
  commands: mockTerminalState.commands,
  commandHistory: mockTerminalState.commandHistory,
  isExecuting: mockTerminalState.isExecuting,
  executeCommand: vi.fn(),
  clearTerminal: vi.fn(),
}));

export const mockUseCommandHistory = vi.fn(() => ({
  historyPosition: -1,
  navigateHistory: vi.fn((direction: "up" | "down", currentInput: string) => {
    if (direction === "up" && mockCommandHistory.length > 0) {
      return mockCommandHistory[mockCommandHistory.length - 1];
    }
    return currentInput;
  }),
  resetHistoryPosition: vi.fn(),
}));

export const mockUseTerminalFocus = vi.fn(() => ({
  inputRef: { current: null },
  terminalRef: { current: null },
  handleTerminalClick: vi.fn(),
}));

export const resetTerminalMocks = () => {
  mockUseTerminal.mockClear();
  mockUseCommandHistory.mockClear();
  mockUseTerminalFocus.mockClear();
};
