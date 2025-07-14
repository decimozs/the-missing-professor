import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

interface StatusBarProps {
  playerName: string;
  score: number;
  messageDecoded: boolean;
  attempts: number;
  currentShift: number;
  onResetGame: () => void;
  onExitGame: () => void;
}

export function StatusBar({
  playerName,
  score,
  messageDecoded,
  attempts,
  currentShift,
  onResetGame,
  onExitGame,
}: StatusBarProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-green-400 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-green-400 text-sm">
            <span className="text-green-300">Player:</span> {playerName}
          </div>
          <div className="text-green-400 text-sm">
            <span className="text-green-300">Score:</span> {score}
          </div>
          <div className="text-green-400 text-sm">
            <span className="text-green-300">Room:</span> 2 - AI Notes Encrypted
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-green-400 text-sm">
            <span className="text-green-300">Current Shift:</span> {currentShift}
          </div>
          <div className="text-green-400 text-sm">
            <span className="text-green-300">Attempts:</span> {attempts}/5
          </div>
          <div className="text-green-400 text-sm">
            <span className="text-green-300">Status:</span>{" "}
            {messageDecoded ? (
              <span className="text-green-400">✓ DECRYPTED</span>
            ) : (
              <span className="text-yellow-400">ANALYZING...</span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigate({ to: "/rooms/room1" })}
            variant="outline"
            size="sm"
            className="bg-gray-800 text-blue-400 border-blue-400 hover:bg-blue-800"
          >
            ← Room 1
          </Button>
          <Button
            onClick={onResetGame}
            variant="outline"
            size="sm"
            className="bg-gray-800 text-yellow-400 border-yellow-400 hover:bg-yellow-800"
          >
            Reset Game
          </Button>
          <Button
            onClick={onExitGame}
            variant="outline"
            size="sm"
            className="bg-gray-800 text-red-400 border-red-400 hover:bg-red-800"
          >
            Exit Game
          </Button>
        </div>
      </div>
    </div>
  );
}
