import { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  input: string;
  output: string | ReactNode;
  timestamp: Date;
}

type AvailableCommand =
  | "help"
  | "about"
  | "skills"
  | "whoami"
  | "projects"
  | "contact"
  | "clear"
  | "sudo"
  | "matrix"
  | "ascii"
  | "theme";

const ASCII_ART = `
███╗   ███╗ █████╗ ██╗  ██╗██████╗ ██╗
████╗ ████║██╔══██╗██║  ██║██╔══██╗██║
██╔████╔██║███████║███████║██║  ██║██║
██║╚██╔╝██║██╔══██║██╔══██║██║  ██║██║
██║ ╚═╝ ██║██║  ██║██║  ██║██████╔╝██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝
Senior Backend Engineer & Cloud Architect
`;

const AVAILABLE_COMMANDS: Record<AvailableCommand, string | ReactNode> = {
  help: (
    <div className="space-y-1">
      <div className="text-neon-orange">Available commands:</div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-neon-blue">help</span> - Show this help message
        </div>
        <div>
          <span className="text-neon-blue">about</span> - About me
        </div>
        <div>
          <span className="text-neon-blue">skills</span> - Technical skills
        </div>
        <div>
          <span className="text-neon-blue">projects</span> - View projects
        </div>
        <div>
          <span className="text-neon-blue">contact</span> - Contact info
        </div>
        <div>
          <span className="text-neon-blue">whoami</span> - Who am I?
        </div>
        <div>
          <span className="text-neon-blue">clear</span> - Clear terminal
        </div>
        <div>
          <span className="text-neon-blue">matrix</span> - Toggle matrix effect
        </div>
        <div>
          <span className="text-neon-blue">ascii</span> - Show ASCII art
        </div>
        <div>
          <span className="text-neon-blue">theme</span> - Toggle theme
        </div>
        <div>
          <span className="text-neon-purple">sudo</span> - Admin mode 🤫
        </div>
      </div>
      <div className="mt-2 text-gray-400">Type any command to begin...</div>
    </div>
  ),
  about: (
    <div className="space-y-2 animate-glow">
      <p>Senior Backend Engineer with 9+ years of experience in scalable systems</p>
      <p>Specialized in:</p>
      <ul className="list-disc list-inside space-y-1 ml-4">
        <li>Cloud Native Applications</li>
        <li>Microservices Architecture</li>
        <li>DevOps & Infrastructure</li>
        <li>Scalable Backend Systems</li>
      </ul>
    </div>
  ),
  skills: (
    <div className="space-y-3">
      <div className="glitch-text">Technical Skills:</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-neon-orange">Backend</div>
          <div className="ml-4 space-y-1">
            <div>• Node.js</div>
            <div>• TypeScript</div>
            <div>• NestJS</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-neon-blue">Cloud</div>
          <div className="ml-4 space-y-1">
            <div>• Azure</div>
            <div>• AWS</div>
            <div>• Kubernetes</div>
          </div>
        </div>
      </div>
    </div>
  ),
  whoami: (
    <div className="typewriter">
      <pre className="text-neon-orange">{ASCII_ART}</pre>
    </div>
  ),
  projects: 'Type "projects --list" to see my notable projects',
  contact: (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-neon-orange">Email:</span>
        <a href="mailto:m8rashidi@gmail.com" className="hover:text-neon-blue transition-colors">
          m8rashidi@gmail.com
        </a>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-neon-orange">GitHub:</span>
        <a
          href="https://github.com/mrdevx"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neon-blue transition-colors"
        >
          @mrdevx
        </a>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-neon-orange">LinkedIn:</span>
        <a
          href="https://linkedin.com/in/mrdevx"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neon-blue transition-colors"
        >
          @mrdevx
        </a>
      </div>
    </div>
  ),
  clear: "CLEAR",
  sudo: "Access denied: Nice try! 😎",
  matrix: "TOGGLE_MATRIX",
  ascii: ASCII_ART,
  theme: "TOGGLE_THEME",
};

export default function Terminal() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const [theme, setTheme] = useState<"cyberpunk" | "hacker">("cyberpunk");

  const handleCommand = useCallback(
    (cmd: string) => {
      const normalizedCmd = cmd.toLowerCase().trim();
      let output: string | ReactNode = 'Command not found. Type "help" for available commands.';

      if (normalizedCmd === "clear") {
        setCommands([]);
        return;
      }

      if (normalizedCmd === "matrix") {
        setShowMatrix((prev) => !prev);
        output = `Matrix effect ${showMatrix ? "disabled" : "enabled"}`;
      }

      if (normalizedCmd === "theme") {
        setTheme((prev) => (prev === "cyberpunk" ? "hacker" : "cyberpunk"));
        output = `Theme switched to ${theme === "cyberpunk" ? "hacker" : "cyberpunk"} mode`;
      }

      if (normalizedCmd === "projects --list") {
        output = (
          <div className="space-y-3">
            <div className="text-neon-orange">Notable Projects:</div>
            <div className="grid gap-4">
              <div className="terminal-card p-4 hover:scale-105 transition-transform">
                <div className="text-neon-blue">E-Mobility Platform (inno2fleet)</div>
                <p className="text-sm mt-2">Cloud-native platform for managing electric vehicle fleets</p>
              </div>
              <div className="terminal-card p-4 hover:scale-105 transition-transform">
                <div className="text-neon-blue">Flight Operations System</div>
                <p className="text-sm mt-2">Real-time flight tracking and operations management</p>
              </div>
              <div className="terminal-card p-4 hover:scale-105 transition-transform">
                <div className="text-neon-blue">Open Banking Integration</div>
                <p className="text-sm mt-2">Secure banking system integration platform</p>
              </div>
            </div>
          </div>
        );
      } else if (normalizedCmd in AVAILABLE_COMMANDS) {
        output = AVAILABLE_COMMANDS[normalizedCmd as AvailableCommand];
      }

      const newCommand: Command = {
        input: cmd,
        output,
        timestamp: new Date(),
      };

      setCommands((prev) => [...prev, newCommand]);
    },
    [showMatrix, theme]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && input.trim()) {
        handleCommand(input);
        setInput("");
      }
    },
    [handleCommand, input]
  );

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleKonami = useCallback(
    (e: KeyboardEvent) => {
      const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
      ];

      if (e.key === konamiCode[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        if (nextIndex === konamiCode.length) {
          handleCommand("Achievement unlocked: You found the Konami code! 🎮");
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(0);
      }
    },
    [konamiIndex, handleCommand]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKonami);
    return () => window.removeEventListener("keydown", handleKonami);
  }, [handleKonami]);

  return (
    <div className={`terminal-window font-jetbrains relative ${theme === "cyberpunk" ? "cyberpunk-theme" : "hacker-theme"}`}>
      {showMatrix && <div className="matrix-rain absolute inset-0 pointer-events-none" />}
      <div className="relative z-10">
        <div className="terminal-header mb-4 flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-neon-orange font-vt323">mrashidi@portfolio:~$</span>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {commands.map((command) => (
              <motion.div
                key={command.timestamp.getTime()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-1"
              >
                <div className="flex items-center">
                  <span className="text-neon-orange font-vt323">mrashidi@portfolio:~$</span>
                  <span className="ml-2 text-neon-green">{command.input}</span>
                </div>
                <div className="text-gray-300 ml-4 output-text">{command.output}</div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center">
            <span className="text-neon-orange font-vt323">mrashidi@portfolio:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="ml-2 bg-transparent border-none outline-none text-neon-green w-full font-jetbrains"
              autoFocus
            />
            {showCursor && <span className="terminal-cursor" />}
          </div>
        </div>
      </div>
    </div>
  );
}
