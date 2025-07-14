import { useNavigate } from "@tanstack/react-router";
import { useGameStore } from "@/stores/gameStore";

interface StatusBarProps {
  playerName: string;
  score: number;
  zipUnlocked: boolean;
  attempts: number;
  onResetGame: () => void;
  onExitGame: () => void;
}

export function StatusBar({
  playerName,
  score,
  zipUnlocked,
  attempts,
  onResetGame,
  onExitGame,
}: StatusBarProps) {
  const navigate = useNavigate();
  const { rooms } = useGameStore();
  
  const room2Unlocked = rooms.find(room => room.id === "room2")?.unlocked;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-700 border-t border-gray-500 p-2">
      <div className="flex justify-between items-center text-xs">
        <div className="text-green-400">
          🏢 ROOM 1: Professor's Office - "The Last Login" | Player:{" "}
          {playerName} | Score: {score}
        </div>
        <div className="text-yellow-400">
          {zipUnlocked ? "✅ PUZZLE SOLVED" : "🔍 INVESTIGATE CLUES"} |
          Attempts: {attempts}
        </div>
        <div className="text-white">
          👤 Prof. E. Ramirez Desktop |
          {room2Unlocked && (
            <>
              <button
                onClick={() => navigate({ to: "/rooms/room2" })}
                className="ml-2 text-blue-400 hover:text-blue-300 underline"
              >
                [Go to Room 2]
              </button>
              |
            </>
          )}
          <button
            onClick={onResetGame}
            className="ml-2 text-red-400 hover:text-red-300 underline"
          >
            [Reset Game]
          </button>
          |
          <button
            onClick={onExitGame}
            className="ml-2 text-yellow-400 hover:text-yellow-300 underline"
          >
            [Exit to Menu]
          </button>
        </div>
      </div>
    </div>
  );
}
