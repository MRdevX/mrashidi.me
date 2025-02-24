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
              <p><span className="text-green-400">Website:</span> <span className="text-gray-400">Next.js 14, TypeScript, Tailwind CSS</span></p>
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

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 border-b border-orange-500/20">
          <div className="w-3 h-3 rounded-full bg-red-500/80" aria-hidden="true" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" aria-hidden="true" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" aria-hidden="true" />
          <span className="ml-2 text-orange-500/80 font-bold">Terminal</span>
        </div>

        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent"
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
