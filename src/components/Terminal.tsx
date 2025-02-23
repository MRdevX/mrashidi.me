import { useEffect, useRef, useState, ReactElement, KeyboardEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  input: string;
  output: string | ReactElement;
  timestamp: Date;
}

const AVAILABLE_COMMANDS = {
  help: "Show available commands",
  about: "Display information about me",
  skills: "List my technical skills",
  projects: "Show my projects",
  contact: "Display contact information",
  clear: "Clear the terminal",
  experience: "Show my work experience",
  "view-source": "View website source code",
  achievements: "List my achievements and certifications",
  blog: "Show my latest blog posts",
  "system-info": "Display system information",
} as const;

type CommandType = keyof typeof AVAILABLE_COMMANDS;

export default function Terminal() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Focus input on mount and when terminal is clicked
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim() as CommandType;
    let output: string | ReactElement = 'Command not found. Type "help" for available commands.';

    try {
      switch (command) {
        case "help":
          output = (
            <div className="mt-2">
              <p className="text-orange-500 font-bold mb-2">Available commands:</p>
              {Object.entries(AVAILABLE_COMMANDS).map(([cmd, desc]) => (
                <div key={cmd} className="grid grid-cols-[120px,1fr] gap-2 mt-1 group">
                  <span className="text-green-400 font-bold group-hover:text-green-300 transition-colors">{cmd}</span>
                  <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</span>
                </div>
              ))}
            </div>
          );
          break;
        case "about":
          output = (
            <div className="mt-2">
              <p>👋 Hi! I&apos;m Mahdi Rashidi, a Senior Backend Engineer with 9+ years of experience.</p>
              <p className="mt-2">
                I specialize in building scalable backend systems, cloud architecture, and DevOps practices. Currently
                working with Node.js, TypeScript, and various cloud technologies.
              </p>
            </div>
          );
          break;
        case "clear":
          setCommands([]);
          return;
        default:
          if (command in AVAILABLE_COMMANDS) {
            output = "This command is not implemented yet. Try 'help' for available commands.";
          }
      }
    } catch (error) {
      console.error("Error executing command:", error);
      output = "An error occurred while executing the command.";
    }

    setCommands((prev) => [
      ...prev,
      {
        input: cmd,
        output,
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="glass-card h-[400px] font-mono text-sm relative overflow-hidden border border-orange-500/20 hover:border-orange-500/40 transition-colors duration-300"
      onClick={handleTerminalClick}
      role="region"
      aria-label="Terminal interface"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 p-4 border-b border-orange-500/20">
          <div className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true" />
          <span className="ml-2 text-orange-500/80 font-bold">Terminal</span>
        </div>

        <div
          ref={terminalRef}
          className="h-[calc(100%-4rem)] overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent"
        >
          <AnimatePresence>
            {commands.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-orange-500/80 font-bold">guest@mrashidi.me:~$</span>
                  <span className="text-green-400">{cmd.input}</span>
                </div>
                <div className="mt-2 text-gray-300/90">{cmd.output}</div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <span className="text-orange-500/80 font-bold">guest@mrashidi.me:~$</span>
            <span className="text-green-400">{input}</span>
            <span
              className={`w-2 h-5 bg-green-400 ${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="scanline absolute inset-0 pointer-events-none" />

      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label="Terminal input"
        autoComplete="off"
        autoFocus
      />
    </div>
  );
}
