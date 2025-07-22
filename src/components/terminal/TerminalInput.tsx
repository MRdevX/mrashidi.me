import { KeyboardEvent, RefObject } from "react";

interface TerminalInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  isExecuting: boolean;
  className?: string;
}

export default function TerminalInput({ inputRef, value, onChange, onKeyDown, isExecuting, className }: TerminalInputProps) {
  return (
    <div className={`flex items-center gap-2 mt-4 ${className ?? ""}`}>
      <span className="text-green-400">$</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={isExecuting}
        className="flex-1 bg-transparent border-none outline-none text-gray-300 disabled:opacity-50"
        placeholder={isExecuting ? "Executing command..." : "Type 'help' for available commands..."}
        aria-label="Terminal input"
      />
    </div>
  );
}
