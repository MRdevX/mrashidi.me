import { Command } from "./types";
import { TERMINAL_STYLES, TERMINAL_CONSTANTS } from "./constants";
import { formatTimestamp } from "./utils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CommandOutputProps {
  command: Command;
  className?: string;
}

const TerminalSpinner = () => {
  const [frame, setFrame] = useState(0);
  const spinnerFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % spinnerFrames.length);
    }, 100);

    return () => clearInterval(interval);
  }, [spinnerFrames.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-green-400 font-mono">{spinnerFrames[frame]}</span>
      <span className={TERMINAL_STYLES.TEXT.SECONDARY}>Processing...</span>
    </div>
  );
};

const TypewriterText = ({
  text,
  speed = TERMINAL_CONSTANTS.TYPING_SPEED.NORMAL,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <pre className={`whitespace-pre-wrap font-mono text-sm ${className}`}>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          className="text-green-400 animate-pulse"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </pre>
  );
};

const TerminalCommand = ({ input, timestamp }: { input: string; timestamp: Date }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.1 }}
    className="flex items-center gap-2"
  >
    <span className={TERMINAL_STYLES.PROMPT}>$</span>
    <motion.span
      className={TERMINAL_STYLES.TEXT.PRIMARY}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      {input}
    </motion.span>
    <motion.span
      className={TERMINAL_STYLES.TIMESTAMP}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.3 }}
    >
      {formatTimestamp(timestamp)}
    </motion.span>
  </motion.div>
);

export default function CommandOutput({ command, className = "" }: CommandOutputProps) {
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOutput(true);
    }, TERMINAL_CONSTANTS.COMMAND_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const isStringOutput = typeof command.output === "string";
  const isLoading = isStringOutput && (command.output as string).includes("Loading");

  return (
    <motion.div
      className={`mb-4 ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TerminalCommand input={command.input} timestamp={command.timestamp} />

      <motion.div
        className="mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showOutput ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <TerminalSpinner />
            <span className={TERMINAL_STYLES.TEXT.MUTED}>{command.output as string}</span>
          </div>
        ) : isStringOutput ? (
          <TypewriterText
            text={command.output as string}
            speed={
              (command.output as string).length > 100
                ? TERMINAL_CONSTANTS.TYPING_SPEED.FAST
                : TERMINAL_CONSTANTS.TYPING_SPEED.NORMAL
            }
            className={TERMINAL_STYLES.TEXT.PRIMARY}
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
            {command.output}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
