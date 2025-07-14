interface TerminalHeaderProps {
  discoveredFlags: string[];
}

export function TerminalHeader({ discoveredFlags }: TerminalHeaderProps) {
  return (
    <div className="bg-gray-900 border-2 border-green-400 rounded-t-lg p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-green-400 font-bold">
          Command Prompt - PROF-RAMIREZ-PC
        </span>
      </div>
      <div className="text-green-300 text-sm">
        User: Professor | Flags: {discoveredFlags.length}/4
      </div>
    </div>
  );
}
