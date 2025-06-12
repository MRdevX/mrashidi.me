import { Command } from './types';

interface CommandOutputProps {
  command: Command;
}

export default function CommandOutput({ command }: CommandOutputProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-green-400">$</span>
        <span className="text-gray-300">{command.input}</span>
      </div>
      <div className="mt-2 text-gray-300">
        {command.output}
      </div>
    </div>
  );
} 