import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CluesViewer() {
  const { clues } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);

  if (clues.length === 0) return null;

  return (
    <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-[60]">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white mb-2"
        size="sm"
      >
        📋 Clues ({clues.length})
      </Button>

      {isOpen && (
        <div className="bg-black/90 border border-purple-400 rounded-lg p-4 max-w-sm max-h-96 overflow-y-auto shadow-2xl">
          <div className="text-purple-400 text-sm font-bold mb-3">
            COLLECTED CLUES
          </div>

          <div className="space-y-3">
            {clues.map((clue) => (
              <div
                key={clue.id}
                className="bg-gray-900 border border-gray-600 rounded p-3 text-xs"
              >
                <div className="text-purple-400 font-bold mb-1">
                  {clue.title}
                </div>
                <div className="text-green-400 mb-2 font-mono">
                  {clue.content}
                </div>
                <div className="text-gray-400 text-xs">
                  Found: {clue.foundAt} | Room: {clue.roomId.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            size="sm"
            className="w-full mt-3 bg-gray-800 text-purple-400 border-purple-400"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
