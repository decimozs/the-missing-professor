interface TerminalHeaderProps {
  title: string;
  timestamp: string;
}

export function TerminalHeader({ title, timestamp }: TerminalHeaderProps) {
  return (
    <div className="bg-black border-2 border-green-400 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-green-300 text-sm">{timestamp}</div>
      </div>
      <div className="text-green-400 text-xl font-bold text-center tracking-wider">
        {title}
      </div>
      <div className="mt-2 text-green-300 text-sm">
        <span className="text-green-500">user@university-server:~/research$ </span>
        decrypt_message.exe --interactive
      </div>
    </div>
  );
}
