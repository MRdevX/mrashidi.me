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
            <div className="mt-2 space-y-2">
              <p>👋 Hi! I&apos;m Mahdi Rashidi, a Senior Backend Engineer with 9+ years of experience.</p>
              <p>
                I specialize in building scalable backend systems, cloud architecture, and DevOps practices. Currently
                working with Node.js, TypeScript, and various cloud technologies.
              </p>
              <p>
                Based in Istanbul, Turkey, I focus on developing cloud-native applications and optimizing infrastructure
                for performance and cost efficiency.
              </p>
            </div>
          );
          break;

        case "skills":
          output = (
            <div className="mt-2 space-y-4">
              <div>
                <p className="text-orange-500 font-bold mb-2">Core Technologies:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-green-400">• Node.js</span>
                  <span className="text-green-400">• TypeScript</span>
                  <span className="text-green-400">• NestJS</span>
                  <span className="text-green-400">• Express.js</span>
                </div>
              </div>
              <div>
                <p className="text-orange-500 font-bold mb-2">Cloud & DevOps:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-green-400">• Azure</span>
                  <span className="text-green-400">• Kubernetes</span>
                  <span className="text-green-400">• Docker</span>
                  <span className="text-green-400">• Terraform</span>
                </div>
              </div>
              <div>
                <p className="text-orange-500 font-bold mb-2">Databases & Messaging:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-green-400">• PostgreSQL</span>
                  <span className="text-green-400">• MongoDB</span>
                  <span className="text-green-400">• Redis</span>
                  <span className="text-green-400">• RabbitMQ</span>
                </div>
              </div>
            </div>
          );
          break;

        case "projects":
          output = (
            <div className="mt-2 space-y-4">
              <div>
                <p className="text-orange-500 font-bold">E-Mobility Services Platform</p>
                <p className="text-gray-400">Cloud-native platform managing 1,500+ European charging stations</p>
                <p className="text-green-400 text-sm">Tech: Azure, Kubernetes, NestJS, TypeScript</p>
              </div>
              <div>
                <p className="text-orange-500 font-bold">Flight Operations Platform</p>
                <p className="text-gray-400">Real-time aviation operations management system</p>
                <p className="text-green-400 text-sm">Tech: Node.js, MongoDB, Redis, WebSocket</p>
              </div>
              <div>
                <p className="text-orange-500 font-bold">Open Banking System</p>
                <p className="text-gray-400">Secure banking integration platform with enhanced authentication</p>
                <p className="text-green-400 text-sm">Tech: NestJS, PostgreSQL, Redis, RabbitMQ</p>
              </div>
            </div>
          );
          break;

        case "contact":
          output = (
            <div className="mt-2 space-y-2">
              <p className="flex items-center gap-2">
                <span className="text-orange-500">Email:</span>
                <a href="mailto:contact@mrashidi.me" className="text-green-400 hover:underline">
                  contact@mrashidi.me
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500">GitHub:</span>
                <a href="https://github.com/mrdevx" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                  github.com/mrdevx
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500">LinkedIn:</span>
                <a href="https://linkedin.com/in/mrdevx" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                  linkedin.com/in/mrdevx
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-500">Location:</span>
                <span className="text-green-400">Istanbul, Turkey</span>
              </p>
            </div>
          );
          break;

        case "experience":
          output = (
            <div className="mt-2 space-y-4">
              <div>
                <p className="text-orange-500 font-bold">Software Architect Technical Lead</p>
                <p className="text-green-400">Fakir Technology Consultants GmbH (2022 - 2025)</p>
                <p className="text-gray-400">Led development of microservices platform, reduced cloud costs by 45%</p>
              </div>
              <div>
                <p className="text-orange-500 font-bold">Senior Backend Engineer</p>
                <p className="text-green-400">Fakir Technology Consultants GmbH (2021 - 2025)</p>
                <p className="text-gray-400">Built fleet analysis platform, improved system reliability by 30%</p>
              </div>
              <div>
                <p className="text-orange-500 font-bold">Lead Backend Engineer</p>
                <p className="text-green-400">Mehrpardaz (2020 - 2021)</p>
                <p className="text-gray-400">Developed aviation operations platform and established engineering practices</p>
              </div>
            </div>
          );
          break;

        case "view-source":
          output = (
            <div className="mt-2">
              <p>View the source code of this website on GitHub:</p>
              <a
                href="https://github.com/mrdevx/mrashidi.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                github.com/mrdevx/mrashidi.me
              </a>
            </div>
          );
          break;

        case "achievements":
          output = (
            <div className="mt-2 space-y-4">
              <div>
                <p className="text-orange-500 font-bold mb-2">Recent Certifications:</p>
                <ul className="space-y-1">
                  <li className="text-green-400">• Introduction to Generative AI by Google Cloud (2024)</li>
                  <li className="text-green-400">• Advanced Terraform (2024)</li>
                  <li className="text-green-400">• Microservices: Security (2024)</li>
                  <li className="text-green-400">• Azure Administration Essential Training (2024)</li>
                </ul>
              </div>
              <div>
                <p className="text-orange-500 font-bold mb-2">Key Achievements:</p>
                <ul className="space-y-1">
                  <li className="text-gray-400">• Reduced cloud costs by 45% through infrastructure optimization</li>
                  <li className="text-gray-400">• Scaled system to support 1,500+ European charging stations</li>
                  <li className="text-gray-400">• Improved API response times by 35% using Kubernetes</li>
                </ul>
              </div>
            </div>
          );
          break;

        case "blog":
          output = (
            <div className="mt-2">
              <p className="mb-4">Visit my blog for articles on backend development and cloud architecture:</p>
              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:underline"
              >
                mrashidi.me/blog
              </a>
            </div>
          );
          break;

        case "system-info":
          output = (
            <div className="mt-2 space-y-2">
              <p className="text-orange-500 font-bold">System Information:</p>
              <p><span className="text-green-400">OS:</span> <span className="text-gray-400">macOS 14.3.1</span></p>
              <p><span className="text-green-400">Browser:</span> <span className="text-gray-400">{navigator.userAgent}</span></p>
              <p><span className="text-green-400">Website:</span> <span className="text-gray-400">Next.js 15, TypeScript, Tailwind CSS</span></p>
              <p><span className="text-green-400">Theme:</span> <span className="text-gray-400">Cyberpunk-inspired minimal</span></p>
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
    
    // Add command to history
    setCommandHistory((prev) => [cmd, ...prev.slice(0, 19)]);
    setHistoryPosition(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextPosition = Math.min(historyPosition + 1, commandHistory.length - 1);
      if (nextPosition >= 0 && commandHistory.length > 0) {
        setHistoryPosition(nextPosition);
        setInput(commandHistory[nextPosition]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextPosition = Math.max(historyPosition - 1, -1);
      if (nextPosition >= 0) {
        setHistoryPosition(nextPosition);
        setInput(commandHistory[nextPosition]);
      } else {
        setHistoryPosition(-1);
        setInput("");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <motion.div
      className="terminal-container w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className="glass-effect border border-orange-500/20 w-full h-full overflow-hidden shadow-2xl rounded-xl hover:shadow-orange-500/10 transition-all duration-300"
        role="region"
        aria-label="Interactive terminal"
        tabIndex={0}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="terminal-header flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-black/80 via-black/90 to-black/80 border-b border-orange-500/20">
          <div className="flex items-center space-x-2">
            <div className="window-control bg-red-500 hover:bg-red-600 rounded-full w-3 h-3 transition-colors duration-200 flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 text-[8px] text-red-950 transition-opacity">×</span>
            </div>
            <div className="window-control bg-yellow-500 hover:bg-yellow-600 rounded-full w-3 h-3 transition-colors duration-200 flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 text-[8px] text-yellow-950 transition-opacity">−</span>
            </div>
            <div className="window-control bg-green-500 hover:bg-green-600 rounded-full w-3 h-3 transition-colors duration-200 flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 text-[8px] text-green-950 transition-opacity">+</span>
            </div>
          </div>
          <div className="text-xs text-white/90 font-medium">guest@mrashidi.me:~</div>
          <div className="w-14"></div>
        </div>
        <div 
          className="terminal-body p-4 md:p-5 h-96 overflow-y-auto font-mono text-sm bg-black/80 backdrop-blur-sm text-white/90" 
          ref={terminalRef}
        >
          <AnimatePresence>
            {commands.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-400 mb-4"
              >
                <p className="text-orange-500 mb-2">Welcome to Mahdi Rashidi&apos;s terminal interface!</p>
                <p>Type <span className="text-green-400 font-semibold">help</span> to see available commands.</p>
              </motion.div>
            )}
            {commands.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6"
                aria-live={index === commands.length - 1 ? "polite" : "off"}
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-semibold">guest@mrashidi.me:~$</span>
                  <span className="text-white/90">{cmd.input}</span>
                </div>
                <div className="mt-2 text-gray-300">{cmd.output}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex items-start">
            <span className="text-green-400 font-semibold mr-2">guest@mrashidi.me:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-white/90 w-full caret-orange-500 font-mono"
              spellCheck="false"
              autoComplete="off"
              aria-label="Terminal command input"
            />
          </div>
        </div>
        <div className="terminal-footer px-4 py-2 bg-gradient-to-r from-black/80 via-black/90 to-black/80 border-t border-orange-500/20 text-xs text-gray-400 flex flex-col sm:flex-row justify-between gap-1">
          <span>Type <span className="text-orange-500">help</span> for available commands</span>
          <span>
            <kbd className="px-1 py-0.5 bg-black/50 border border-gray-700/50 rounded text-xs mr-1">↑</kbd>
            <kbd className="px-1 py-0.5 bg-black/50 border border-gray-700/50 rounded text-xs">↓</kbd> 
            <span className="ml-1">for command history</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
