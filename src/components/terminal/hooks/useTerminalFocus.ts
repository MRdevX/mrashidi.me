import { useEffect, useRef } from "react";

export const useTerminalFocus = (isExecuting: boolean) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-focus when not executing
  useEffect(() => {
    if (!isExecuting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExecuting]);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (terminalRef.current) {
      const scrollToBottom = () => {
        terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
      };
      requestAnimationFrame(scrollToBottom);
    }
  });

  const handleTerminalClick = () => {
    if (inputRef.current && !isExecuting) {
      inputRef.current.focus();
    }
  };

  return {
    inputRef,
    terminalRef,
    handleTerminalClick,
  };
};
