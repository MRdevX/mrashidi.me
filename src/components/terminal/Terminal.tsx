import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { Command, CommandType } from "./types";
import { handleCommand } from "./commandHandlers";
import TerminalInput from "./TerminalInput";
import TerminalHistory from "./TerminalHistory";

function TerminalContainer() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
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

  const executeCommand = async (cmd: string) => {
    const command = cmd.toLowerCase().trim() as CommandType;
    const commandIndex = commands.length;
    setCommands((prev) => [
      ...prev,
      {
        input: cmd,
        output: command === "blog" ? "Loading blog posts..." : "Executing command...",
        timestamp: new Date(),
      },
    ]);
    setIsExecuting(true);
    try {
      const output = await handleCommand(command);
      setCommands((prev) => {
        const newCommands = [...prev];
        newCommands[commandIndex] = {
          ...newCommands[commandIndex],
          output,
        };
        return newCommands;
      });
      if (command !== "clear") {
        setCommandHistory((prev) => [...prev, cmd]);
      } else {
        setCommands([]);
      }
    } catch (_error) {
      setCommands((prev) => {
        const newCommands = [...prev];
        newCommands[commandIndex] = {
          ...newCommands[commandIndex],
          output: "Error executing command. Please try again.",
        };
        return newCommands;
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() && !isExecuting) {
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

  return (
    <div ref={terminalRef} className="w-full h-[600px] bg-black/90 rounded-lg p-4 font-mono text-sm overflow-y-auto">
      <TerminalHistory commands={commands} />
      <TerminalInput
        inputRef={inputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        isExecuting={isExecuting}
      />
    </div>
  );
}

export default TerminalContainer;
