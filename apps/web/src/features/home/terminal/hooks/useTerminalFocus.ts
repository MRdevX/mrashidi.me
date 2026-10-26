import { type RefObject, useEffect, useRef } from "react";

export const useTerminalFocus = (isExecuting: boolean, inputRef: RefObject<HTMLInputElement | null>) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (!isExecuting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExecuting, inputRef]);

  useEffect(() => {
    if (terminalRef.current) {
      const scrollToBottom = () => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
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
    terminalRef,
    handleTerminalClick,
  };
};
