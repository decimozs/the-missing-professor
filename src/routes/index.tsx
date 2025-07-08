import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [scanlines, setScanlines] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const startGame = () => {
    if (playerName.trim()) {
      setShowTerminal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-400 font-mono text-2xl glitch-text">
          INITIALIZING SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-green-400 font-mono relative overflow-hidden">
      {scanlines && <div className="scanlines"></div>}

      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
          {Array.from({ length: 400 }).map((_, i) => (
            <div key={i} className="border border-green-500/20"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1
            className="text-6xl font-bold mb-4 glitch-text text-red-500"
            style={{ fontFamily: "Jersey 10" }}
          >
            THE MISSING PROFESSOR
          </h1>
          <div className="text-sm text-yellow-400 pulse">
            &gt; CLASSIFIED CTF INVESTIGATION &lt;
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-black/80 border-green-500 border-2 neon-glow rounded-xs">
            <CardHeader className="border-b border-green-500/50">
              <CardTitle className="text-green-400 font-mono text-center">
                SECURITY TERMINAL - CLEARANCE LEVEL: UNKNOWN
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="border border-green-500/30 p-6 bg-green-900/10">
                  <h3 className="text-red-400 text-xl mb-4">
                    &gt; MISSION BRIEFING
                  </h3>
                  <div className="space-y-2 text-sm ">
                    <p>
                      &gt; Dr. Eladio Ramirez, lead AI researcher has vanished
                    </p>
                    <p>
                      &gt; All that remains are encrypted notes, locked files,
                      and strange clues scattered.
                    </p>
                    <p>
                      &gt; Security systems compromised. Multiple access points
                      breached.
                    </p>
                    <p className="text-yellow-400">
                      &gt; Your mission: Navigate through secured facilities and
                      uncover the truth.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 my-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto border-2 border-green-500 bg-green-900/20 flex items-center justify-center mb-2 pixel-art">
                      <span className="text-xs">LAB A</span>
                    </div>
                    <div className="text-xs text-green-300">Security: HIGH</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto border-2 border-red-500 bg-red-900/20 flex items-center justify-center mb-2 pixel-art glitch-box">
                      <span className="text-xs">SECTOR 7</span>
                    </div>
                    <div className="text-xs text-red-300">Status: BREACH</div>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto border-2 border-yellow-500 bg-yellow-900/20 flex items-center justify-center mb-2 pixel-art">
                      <span className="text-xs">SERVER</span>
                    </div>
                    <div className="text-xs text-yellow-300">
                      Access: LOCKED
                    </div>
                  </div>
                </div>

                <div className="border border-green-500/30 p-6 bg-blue-900/10">
                  <h3 className="text-blue-400 text-xl mb-4">
                    &gt; AGENT IDENTIFICATION
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-green-300 mb-2">
                        Enter Agent Codename:
                      </label>
                      <Input
                        type="text"
                        value={playerName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPlayerName(e.target.value)
                        }
                        className="bg-black border-green-500 text-green-400 font-mono focus:border-green-300"
                        placeholder="AGENT_[CODENAME]"
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                          e.key === "Enter" && startGame()
                        }
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={startGame}
                        disabled={!playerName.trim()}
                        className="bg-green-700 hover:bg-green-600 text-black font-bold pixel-art border-2 border-green-500"
                      >
                        &gt; INITIALIZE MISSION
                      </Button>
                      <Button
                        onClick={() => setScanlines(!scanlines)}
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-900/20 pixel-art"
                      >
                        {scanlines ? "DISABLE" : "ENABLE"} SCANLINES
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-green-500 p-2">
          <div className="flex justify-between items-center text-xs">
            <div className="text-green-400">
              STATUS:{" "}
              {showTerminal ? `AGENT ${playerName} - ACTIVE` : "STANDBY"}
            </div>
            <div className="text-yellow-400 pulse">
              SECURITY LEVEL: CLASSIFIED
            </div>
            <div className="text-red-400">THREAT LEVEL: HIGH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
