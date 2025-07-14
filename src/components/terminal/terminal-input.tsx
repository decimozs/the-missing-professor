import { useRef, useEffect } from "react";

interface TerminalInputProps {
  currentDirectory: string;
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  gameCompleted: boolean;
}

export function TerminalInput({
  currentDirectory,
  currentInput,
  setCurrentInput,
  onSubmit,
  isProcessing,
  gameCompleted,
}: TerminalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !gameCompleted && !isProcessing) {
      inputRef.current.focus();
    }
  }, [gameCompleted, isProcessing]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center absolute bottom-4 left-4 right-4">
      <span className="text-green-400 mr-2">{currentDirectory}</span>
      <input
        ref={inputRef}
        type="text"
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyPress={handleKeyPress}
        onBlur={() => {
          if (!gameCompleted && !isProcessing) {
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
        disabled={isProcessing || gameCompleted}
        className="flex-1 bg-transparent text-green-400 outline-none border-none"
        placeholder={gameCompleted ? "Game completed!" : "Enter command..."}
        autoFocus
      />
      {!gameCompleted && (
        <div className="w-2 h-5 bg-green-400 animate-pulse ml-1"></div>
      )}
    </div>
  );
}
