import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { RoomNavigation } from "@/components/room_navigation";
import { CluesViewer } from "@/components/clues_viewer";
import {
  TerminalHeader,
  EncryptedMessage,
  CipherTools,
  DecodingArea,
  StatusBar,
} from "@/components/room2";

export const Route = createFileRoute("/rooms/room2")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [shiftValue, setShiftValue] = useState(0);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [messageDecoded, setMessageDecoded] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const {
    submitAnswer,
    addClue,
    updateRoom2Progress,
    room2Progress,
    resetGame,
    playerName,
    score,
    clues,
    setCurrentRoom,
  } = useGameStore();

  const encryptedMessage = "EBIIL, VLR EXSB AFPZLSBOBA QEB CFOPQ EFKQ. OBQROK QL QEB ABPH CLO QEB KBUQ ZIRB.";
  const correctDecoded = "HELLO, YOU HAVE DISCOVERED THE FIRST HINT. RETURN TO THE DESK FOR THE NEXT CLUE.";

  // Get the encrypted message from Room 1 clues
  const room1Message = clues.find(clue => clue.id === "room1-message");
  
  useEffect(() => {
    setCurrentRoom("room2");
    // Auto-populate if player hasn't started Room 2 but has Room 1 message
    if (room1Message && !room2Progress.started) {
      updateRoom2Progress({ started: true });
    }
  }, [room1Message, room2Progress.started, updateRoom2Progress, setCurrentRoom]);

  const caesarDecrypt = (text: string, shift: number): string => {
    return text
      .split("")
      .map((char) => {
        if (char.match(/[A-Z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        }
        if (char.match(/[a-z]/)) {
          return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        }
        return char;
      })
      .join("");
  };

  const handleShiftChange = (newShift: number) => {
    setShiftValue(newShift);
    const decoded = caesarDecrypt(encryptedMessage, newShift);
    setDecodedMessage(decoded);
  };

  const handleSubmitDecryption = () => {
    console.log("Comparing:", decodedMessage.toUpperCase(), "vs", correctDecoded.toUpperCase());
    if (decodedMessage.toUpperCase().trim() === correctDecoded.toUpperCase().trim()) {
      setMessageDecoded(true);
      updateRoom2Progress({ 
        solved: true, 
        correctShift: shiftValue,
        attempts: attempts + 1 
      });
      submitAnswer("room2-cipher", decodedMessage);
      addClue({
        id: "room2-decoded",
        title: "Decoded Message",
        content: decodedMessage,
        foundAt: "Caesar Cipher Decryption",
        roomId: "room2",
      });
      addClue({
        id: "room2-ai-lab-notes",
        title: "AI_LAB_NOTES.txt",
        content: "To wake up E.R speak its first poem. Not a greeting but a riddle.",
        foundAt: "Decryption terminal download",
        roomId: "room2",
      });
      addClue({
        id: "room2-flag",
        title: "Room 2 Flag",
        content: "LOCATION_AI_TERMINAL",
        foundAt: "Successful decryption",
        roomId: "room2",
      });
    } else {
      const newAttempts = attempts + 1;
      const newWrongAttempts = wrongAttempts + 1;
      setAttempts(newAttempts);
      setWrongAttempts(newWrongAttempts);
      updateRoom2Progress({ attempts: newAttempts });
      
      // Show different hints based on wrong attempts
      if (newWrongAttempts >= 2) {
        setShowHint(true);
      }
      
      // Penalty: reset shift to 0 after 3 wrong attempts
      if (newWrongAttempts >= 3) {
        setShiftValue(0);
        setDecodedMessage("");
      }
    }
  };

  const handleExitGame = () => {
    resetGame();
    navigate({ to: "/" });
  };

  const handleNextRoom = () => {
    navigate({ to: "/rooms/room3" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-green-400 font-mono relative overflow-hidden">
      {/* Scanlines effect */}
      <div className="scanlines"></div>

      {/* Matrix background */}
      <div className="matrix-bg"></div>

      {/* Room Navigation */}
      <RoomNavigation />

      {/* Clues Viewer */}
      <CluesViewer />

      {/* Terminal container */}
      <div className="relative z-10 p-4 min-h-screen">
        <TerminalHeader 
          title="RESEARCH TERMINAL - DECRYPTION MODULE"
          timestamp="03/18/2025 - 14:45"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full mt-6">
          {/* Left side - Encrypted message and tools */}
          <div className="space-y-6">
            <EncryptedMessage 
              message={encryptedMessage}
              source="Professor's ZIP file (Room 1)"
            />
            
            <CipherTools
              shiftValue={shiftValue}
              onShiftChange={handleShiftChange}
              onSubmit={handleSubmitDecryption}
              attempts={attempts}
              showHint={showHint}
              messageDecoded={messageDecoded}
            />
          </div>

          {/* Right side - Decoding area */}
          <DecodingArea
            encryptedMessage={encryptedMessage}
            decodedMessage={decodedMessage}
            shiftValue={shiftValue}
            messageDecoded={messageDecoded}
            onNextRoom={handleNextRoom}
          />
        </div>

        {/* Bottom status bar */}
        <StatusBar
          playerName={playerName}
          score={score}
          messageDecoded={messageDecoded}
          attempts={attempts}
          currentShift={shiftValue}
          onResetGame={resetGame}
          onExitGame={handleExitGame}
        />
      </div>
    </div>
  );
}
