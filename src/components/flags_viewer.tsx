import { useState } from "react";
import { Flag, Eye, EyeOff, Key, Lock } from "lucide-react";

interface FlagsViewerProps {
  discoveredFlags: string[];
  authenticatedFlags: string[];
}

export function FlagsViewer({
  discoveredFlags,
  authenticatedFlags,
}: FlagsViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const allPossibleFlags = [
    { name: "1968ER", description: "Room 1 Discovery" },
    { name: "AI_LAB_NOTES", description: "Room 2 AI Lab" },
    { name: "L0C4T1ON_U5B", description: "Room 3 Location" },
    { name: "Professor_USF_24", description: "Room 4 Final Key" },
  ];

  const getFlagStatus = (flagName: string) => {
    if (authenticatedFlags.includes(flagName)) {
      return { status: "authenticated", icon: Key, color: "text-green-400" };
    } else if (discoveredFlags.includes(flagName)) {
      return { status: "discovered", icon: Flag, color: "text-yellow-400" };
    } else {
      return { status: "locked", icon: Lock, color: "text-red-400" };
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-900 border-2 border-blue-400 rounded-lg p-2 text-blue-400 hover:bg-blue-800 transition-colors flex items-center gap-2 mb-2"
        title="Toggle Flags Viewer"
      >
        <Flag size={16} />
        <span className="text-sm font-mono">FLAGS</span>
        {isOpen ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>

      {/* Flags Panel */}
      {isOpen && (
        <div className="bg-gray-900 border-2 border-blue-400 rounded-lg p-4 min-w-[280px] max-h-96 overflow-y-auto shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-blue-400 font-mono font-bold">
            <Flag size={16} />
            <span>COLLECTED FLAGS</span>
          </div>

          <div className="space-y-2">
            {allPossibleFlags.map((flag) => {
              const {
                status,
                icon: StatusIcon,
                color,
              } = getFlagStatus(flag.name);

              return (
                <div
                  key={flag.name}
                  className={`flex items-center gap-2 p-2 rounded border ${
                    status === "authenticated"
                      ? "bg-green-900 border-green-400"
                      : status === "discovered"
                        ? "bg-yellow-900 border-yellow-400"
                        : "bg-gray-800 border-gray-600"
                  }`}
                >
                  <StatusIcon size={14} className={color} />
                  <div className="flex-1">
                    <div className={`font-mono text-sm ${color}`}>
                      {flag.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {flag.description}
                    </div>
                  </div>
                  <div className={`text-xs font-mono ${color}`}>
                    {status === "authenticated"
                      ? "AUTH"
                      : status === "discovered"
                        ? "DISC"
                        : "LOCK"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-400">
            <div>Discovered: {discoveredFlags.length}/4</div>
            <div>Authenticated: {authenticatedFlags.length}/4</div>
          </div>

          {/* Legend */}
          <div className="mt-2 pt-2 border-t border-gray-600 text-xs space-y-1">
            <div className="text-gray-400 font-bold">LEGEND:</div>
            <div className="flex items-center gap-2">
              <Key size={10} className="text-green-400" />
              <span className="text-green-400">Authenticated</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag size={10} className="text-yellow-400" />
              <span className="text-yellow-400">Discovered</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={10} className="text-red-400" />
              <span className="text-red-400">Locked</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
