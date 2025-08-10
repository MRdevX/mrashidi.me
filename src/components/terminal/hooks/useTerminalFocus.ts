import { useEffect, useRef } from "react";

export const useTerminalFocus = (isExecuting: boolean) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isExecuting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExecuting]);

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
