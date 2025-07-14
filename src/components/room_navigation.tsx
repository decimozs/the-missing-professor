import { useNavigate } from "@tanstack/react-router";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/button";

export function RoomNavigation() {
  const navigate = useNavigate();
  const { rooms, currentRoom } = useGameStore();

  const unlockedRooms = rooms.filter(room => room.unlocked);

  if (unlockedRooms.length <= 1) {
    return null; // Don't show navigation if only one room is unlocked
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-black/80 border border-green-400 rounded-lg p-3">
        <div className="text-green-400 text-xs mb-2 font-bold">ROOM ACCESS</div>
        <div className="space-y-1">
          {unlockedRooms.map((room) => (
            <Button
              key={room.id}
              onClick={() => navigate({ to: `/rooms/${room.id}` })}
              disabled={currentRoom === room.id}
              className={`w-full text-xs px-2 py-1 h-8 ${
                currentRoom === room.id
                  ? "bg-green-600 text-white cursor-not-allowed"
                  : room.completed
                  ? "bg-gray-700 text-green-400 border-green-400 hover:bg-green-800"
                  : "bg-gray-800 text-yellow-400 border-yellow-400 hover:bg-yellow-800"
              }`}
              variant="outline"
            >
              {room.completed ? "✓" : "●"} {room.id.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
