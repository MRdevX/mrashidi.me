import { Command } from "./types";
import CommandOutput from "./CommandOutput";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalHistoryProps {
  commands: Command[];
  className?: string;
}

export default function TerminalHistory({ commands, className }: TerminalHistoryProps) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
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
  );
}
