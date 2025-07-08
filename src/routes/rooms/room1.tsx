import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import {
  DesktopHeader,
  DesktopIcons,
  WindowsArea,
  StatusBar,
} from "@/components/room1";

export const Route = createFileRoute("/rooms/room1")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showLog, setShowLog] = useState(false);
  const [showStickyNote, setShowStickyNote] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const {
    submitAnswer,
    addClue,
    updateRoom1Progress,
    room1Progress,
    resetGame,
    playerName,
    score,
  } = useGameStore();

  const correctPassword = "1968ER";
  const encryptedMessage =
    "KHOOR, BRX KDYH GLVFRYHUHG WKH ILUVW KLQW. UHWXUQ WR WKH GHVN IRU WKH QH[W FORVH.";

  const { zipClicked, attempts, zipUnlocked } = room1Progress;

  useEffect(() => {
    const timer = setTimeout(() => setShowLog(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePasswordSubmit = () => {
    if (password.toUpperCase() === correctPassword) {
      updateRoom1Progress({ zipUnlocked: true });
      submitAnswer("room1-zip", password);
      addClue({
        id: "room1-message",
        title: "Encrypted Message",
        content: encryptedMessage,
        foundAt: "Professor's ZIP file",
        roomId: "room1",
      });
    } else {
      const newAttempts = attempts + 1;
      updateRoom1Progress({ attempts: newAttempts });
      if (newAttempts >= 2) {
        setShowHint(true);
      }
    }
    setPassword("");
  };

  const handleStickyNoteClick = () => {
    setShowStickyNote(true);
    updateRoom1Progress({ stickyNoteViewed: true });
  };

  const handleZipClick = () => {
    updateRoom1Progress({ zipClicked: true });
  };

  const handleLogClick = () => {
    setShowLog(true);
    updateRoom1Progress({ logViewed: true });
  };

  const handleExitGame = () => {
    resetGame();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-green-400 font-mono relative overflow-hidden">
      <div className="scanlines"></div>

      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>

      <div className="relative z-10 p-4 min-h-screen">
        <DesktopHeader
          professorName="E. Ramirez"
          currentTime="03/18/2025 - 14:23"
        />

        <div className="grid grid-cols-4 gap-6 h-full">
          <DesktopIcons
            zipUnlocked={zipUnlocked}
            onZipClick={handleZipClick}
            onStickyNoteClick={handleStickyNoteClick}
            onLogClick={handleLogClick}
          />

          <WindowsArea
            zipClicked={zipClicked}
            zipUnlocked={zipUnlocked}
            password={password}
            onPasswordChange={setPassword}
            onPasswordSubmit={handlePasswordSubmit}
            onZipCancel={() => updateRoom1Progress({ zipClicked: false })}
            attempts={attempts}
            showHint={showHint}
            encryptedMessage={encryptedMessage}
            showLog={showLog}
            onLogClose={() => setShowLog(false)}
            showStickyNote={showStickyNote}
            onStickyNoteClose={() => setShowStickyNote(false)}
          />
        </div>

        {/* Bottom status bar */}
        <StatusBar
          playerName={playerName}
          score={score}
          zipUnlocked={zipUnlocked}
          attempts={attempts}
          onResetGame={resetGame}
          onExitGame={handleExitGame}
        />
      </div>
    </div>
  );
}
