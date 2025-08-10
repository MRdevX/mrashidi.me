import { useState, KeyboardEvent } from "react";
import { useTerminal, useCommandHistory, useTerminalFocus } from "./hooks";
import TerminalInput from "./TerminalInput";
import TerminalHistory from "./TerminalHistory";
import { TERMINAL_STYLES } from "./constants";
import { motion } from "framer-motion";

function TerminalContainer() {
  const [input, setInput] = useState("");

  const { commands, commandHistory, isExecuting, executeCommand } = useTerminal();
  const { navigateHistory, resetHistoryPosition } = useCommandHistory(commandHistory);
  const { inputRef, terminalRef, handleTerminalClick } = useTerminalFocus(isExecuting);

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && !isExecuting) {
      executeCommand(input);
      setInput("");
      resetHistoryPosition();
    } else if (e.key === "ArrowUp") {
      const newInput = navigateHistory("up", input);
      setInput(newInput);
    } else if (e.key === "ArrowDown") {
      const newInput = navigateHistory("down", input);
      setInput(newInput);
    }
  };

  return (
    <motion.div
      ref={terminalRef}
      className={TERMINAL_STYLES.CONTAINER}
      onClick={handleTerminalClick}
      role="application"
      aria-label="Interactive terminal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <TerminalHistory commands={commands} />
      <TerminalInput
        inputRef={inputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isExecuting={isExecuting}
      />
    </motion.div>
  );
}

export default TerminalContainer;
