import type { KeyboardEvent } from "react";

interface TerminalInputProps {
  inputRef: { current: HTMLInputElement | null };
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isExecuting: boolean;
  className?: string;
  placeholder?: string;
}

export const terminalInputPropsFixtures = {
  default: {
    inputRef: { current: null },
    value: "",
    onChange: () => {},
    onKeyDown: () => {},
    isExecuting: false,
  },
  withValue: {
    inputRef: { current: null },
    value: "help",
    onChange: () => {},
    onKeyDown: () => {},
    isExecuting: false,
  },
  executing: {
    inputRef: { current: null },
    value: "",
    onChange: () => {},
    onKeyDown: () => {},
    isExecuting: true,
  },
  withValueAndExecuting: {
    inputRef: { current: null },
    value: "about",
    onChange: () => {},
    onKeyDown: () => {},
    isExecuting: true,
  },
} as const;

export const keyboardEventFixtures = {
  enter: {
    key: "Enter",
    code: "Enter",
    keyCode: 13,
  },
  arrowUp: {
    key: "ArrowUp",
    code: "ArrowUp",
    keyCode: 38,
  },
  arrowDown: {
    key: "ArrowDown",
    code: "ArrowDown",
    keyCode: 40,
  },
  tab: {
    key: "Tab",
    code: "Tab",
    keyCode: 9,
  },
  escape: {
    key: "Escape",
    code: "Escape",
    keyCode: 27,
  },
  letterA: {
    key: "a",
    code: "KeyA",
    keyCode: 65,
  },
} as const;

export const formEventFixtures = {
  inputChange: {
    target: {
      value: "help",
    },
  },
  inputChangeWithSpaces: {
    target: {
      value: "  help  ",
    },
  },
  inputChangeEmpty: {
    target: {
      value: "",
    },
  },
} as const;

export const accessibilityFixtures = {
  ariaLabels: {
    terminalInput: "Terminal input",
    terminalContainer: "Interactive terminal",
  },
  roles: {
    textbox: "textbox",
    application: "application",
  },
  attributes: {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: "false",
  },
} as const;

export const cssClassFixtures = {
  terminalStyles: {
    container:
      "w-full h-[600px] bg-white/60 dark:bg-black/95 rounded-lg p-4 font-mono text-sm overflow-y-auto cursor-text border border-gray-300 dark:border-gray-800 shadow-lg",
    prompt: "text-green-600 dark:text-green-400 select-none font-bold",
    input:
      "flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-300 disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-600 font-mono",
  },
  textColors: {
    primary: "text-gray-800 dark:text-gray-300",
    secondary: "text-gray-600 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
    muted: "text-gray-500 dark:text-gray-600",
  },
} as const;
