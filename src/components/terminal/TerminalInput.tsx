import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { type KeyboardEvent, type RefObject, useEffect, useState } from "react";
import { TERMINAL_CONSTANTS, TERMINAL_STYLES } from "./constants";

interface TerminalInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isExecuting: boolean;
  className?: string;
  placeholder?: string;
}

const TerminalCursor = ({ isVisible }: { isVisible: boolean }) => (
  <motion.span
    className="text-green-400 font-mono"
    animate={{ opacity: isVisible ? 1 : 0 }}
    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
  >
    █
  </motion.span>
);

export function TerminalInput({
  inputRef,
  value,
  onChange,
  onKeyDown,
  isExecuting,
  className = "",
  placeholder = TERMINAL_CONSTANTS.DEFAULT_PLACEHOLDER,
}: TerminalInputProps) {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isExecuting) {
      setShowCursor(false);
      return;
    }

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, TERMINAL_CONSTANTS.CURSOR_BLINK_RATE);

    return () => clearInterval(interval);
  }, [isExecuting]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowUp", "ArrowDown", "Tab"].includes(e.key)) {
      e.preventDefault();
    }
    onKeyDown(e);
  };

  return (
    <motion.div
      className={`flex items-center gap-2 mt-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Terminal className="w-4 h-4 text-green-400" />
        <span className={TERMINAL_STYLES.PROMPT}>$</span>
      </motion.div>
      <div className="flex items-center flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isExecuting}
          className={`${TERMINAL_STYLES.INPUT} flex-1`}
          placeholder={isExecuting ? TERMINAL_CONSTANTS.EXECUTING_PLACEHOLDER : placeholder}
          aria-label="Terminal input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {!isExecuting && <TerminalCursor isVisible={showCursor} />}
      </div>
    </motion.div>
  );
}
