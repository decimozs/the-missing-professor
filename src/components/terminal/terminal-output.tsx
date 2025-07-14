interface TerminalOutputProps {
  terminalLines: string[];
  isProcessing: boolean;
}

export function TerminalOutput({
  terminalLines,
  isProcessing,
}: TerminalOutputProps) {
  return (
    <div className="space-y-1 mb-4 max-h-[500px] overflow-y-auto">
      {terminalLines.map((line, index) => (
        <div key={index} className="text-green-400 whitespace-pre-wrap">
          {line}
        </div>
      ))}
      {isProcessing && (
        <div className="text-yellow-400 animate-pulse">Processing...</div>
      )}
    </div>
  );
}
