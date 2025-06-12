import { useEffect, useRef, useState, KeyboardEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, CommandType } from "./types";
import { handleCommand } from "./commandHandlers";
import CommandOutput from "./CommandOutput";

export default function Terminal() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      const scrollToBottom = () => {
        terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
      };
      requestAnimationFrame(scrollToBottom);
    }
  }, [commands, input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim() as CommandType;
    const output = handleCommand(command);

    setCommands((prev) => [
      ...prev,
      {
        input: cmd,
        output,
        timestamp: new Date(),
      },
    ]);

    if (command !== "clear") {
      setCommandHistory((prev) => [...prev, cmd]);
    } else {
      setCommands([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      executeCommand(input);
      setInput("");
      setHistoryPosition(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newPosition = Math.min(historyPosition + 1, commandHistory.length - 1);
        setHistoryPosition(newPosition);
        setInput(commandHistory[commandHistory.length - 1 - newPosition]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyPosition > 0) {
        const newPosition = historyPosition - 1;
        setHistoryPosition(newPosition);
        setInput(commandHistory[commandHistory.length - 1 - newPosition]);
      } else if (historyPosition === 0) {
        setHistoryPosition(-1);
        setInput("");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div
      ref={terminalRef}
      className="w-full h-[600px] bg-black/90 rounded-lg p-4 font-mono text-sm overflow-y-auto"
    >
      <div className="space-y-2">
        <AnimatePresence>
          {commands.map((command, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CommandOutput command={command} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span className="text-green-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-gray-300"
          placeholder="Type 'help' for available commands..."
        />
      </div>
    </div>
  );
}
