import { Command } from "./types";
import { CommandOutput } from "./CommandOutput";
import { motion, AnimatePresence } from "framer-motion";
import { generateCommandKey } from "./utils";

interface TerminalHistoryProps {
  commands: Command[];
  className?: string;
}

export function TerminalHistory({ commands, className = "" }: TerminalHistoryProps) {
  if (commands.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <AnimatePresence mode="popLayout">
        {commands.map((command, index) => (
          <motion.div
            key={generateCommandKey(command, index)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            layout
          >
            <CommandOutput command={command} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
