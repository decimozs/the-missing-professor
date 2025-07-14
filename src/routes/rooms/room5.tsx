import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { RoomNavigation } from "@/components/room_navigation";
import { CluesViewer } from "@/components/clues_viewer";
import { FlagsViewer } from "@/components/flags_viewer";
import { TerminalHeader } from "@/components/terminal/terminal-header";
import { TerminalOutput } from "@/components/terminal/terminal-output";
import { TerminalInput } from "@/components/terminal/terminal-input";
import { GameCompletion } from "@/components/terminal/game-completion";
import { createFileSystem } from "@/types/fileSystem";
import { FileSystemNavigator } from "@/utils/fileSystemNavigator";
import { CommandProcessor } from "@/utils/commandProcessor";

export const Route = createFileRoute("/rooms/room5")({
  component: RouteComponent,
});

function RouteComponent() {
  const { clues, setCurrentRoom, addClue } = useGameStore();

  // Terminal states
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // File system simulation states
  const [currentDirectory, setCurrentDirectory] = useState(
    "C:\\Users\\Professor"
  );
  const [discoveredFlags, setDiscoveredFlags] = useState<string[]>([]);
  const [authenticatedFlags, setAuthenticatedFlags] = useState<string[]>([]);

  // File system and command processor
  const fileSystem = createFileSystem();
  const navigator = new FileSystemNavigator(fileSystem);

  // Terminal line management
  const addTerminalLine = useCallback((line: string) => {
    setTerminalLines((prev) => [...prev, line]);
  }, []);

  // Command processor with context
  const commandProcessor = new CommandProcessor({
    currentDirectory,
    discoveredFlags,
    authenticatedFlags,
    clues,
    navigator,
    addTerminalLine,
    addClue,
    setDiscoveredFlags,
    setAuthenticatedFlags,
    setCurrentDirectory,
    setGameCompleted,
  });

  // Initialize terminal
  useEffect(() => {
    setCurrentRoom("room5");

    // Prevent double initialization
    if (hasInitialized) return;
    setHasInitialized(true);

    // Collect flags from clues from previous rooms
    const foundFlags: string[] = [];

    // Debug: Log all clues to understand what we have
    console.log("All clues:", clues);

    clues.forEach((clue, index) => {
      console.log(`Clue ${index}:`, {
        roomId: clue.roomId,
        title: clue.title,
        content: clue.content,
      });

      // Room 1 flag - 1968ER
      if (
        clue.content.includes("1968ER") ||
        clue.title.includes("1968ER") ||
        clue.roomId === "room1"
      ) {
        foundFlags.push("1968ER");
        console.log("Found 1968ER flag");
      }

      // Room 2 flag - AI_LAB_NOTES
      if (
        clue.content.includes("AI_LAB_NOTES") ||
        clue.title.includes("AI_LAB_NOTES") ||
        clue.content.toLowerCase().includes("ai lab notes") ||
        clue.content.toLowerCase().includes("artificial intelligence") ||
        clue.roomId === "room2"
      ) {
        foundFlags.push("AI_LAB_NOTES");
        console.log("Found AI_LAB_NOTES flag");
      }

      // Room 3 flag - L0C4T1ON_U5B (with multiple possible spellings)
      if (
        clue.content.includes("L0C4T1ON_U5B") ||
        clue.title.includes("L0C4T1ON_U5B") ||
        clue.content.includes("L0C4T10N_U5B") ||
        clue.content.includes("LOCATION_USB") ||
        clue.content.toLowerCase().includes("location") ||
        clue.content.toLowerCase().includes("usb") ||
        clue.roomId === "room3"
      ) {
        foundFlags.push("L0C4T1ON_U5B");
        console.log("Found L0C4T1ON_U5B flag");
      }

      // Room 4 flag - Professor_USF_24
      if (
        clue.content.includes("Professor_USF_24") ||
        clue.title.includes("Professor_USF_24") ||
        clue.roomId === "room4"
      ) {
        foundFlags.push("Professor_USF_24");
        console.log("Found Professor_USF_24 flag");
      }
    });

    // Remove duplicates and set flags
    const uniqueFlags = [...new Set(foundFlags)];
    console.log("Discovered flags:", uniqueFlags);
    setDiscoveredFlags(uniqueFlags);

    // For debugging purposes, let's also add a fallback to ensure all room flags are discovered
    // This can be removed once the flag discovery is working properly
    if (clues.length > 0) {
      const roomIds = clues.map((clue) => clue.roomId);
      const fallbackFlags = [];
      if (roomIds.includes("room1")) fallbackFlags.push("1968ER");
      if (roomIds.includes("room2")) fallbackFlags.push("AI_LAB_NOTES");
      if (roomIds.includes("room3")) fallbackFlags.push("L0C4T1ON_U5B");
      if (roomIds.includes("room4")) fallbackFlags.push("Professor_USF_24");

      const combinedFlags = [...new Set([...uniqueFlags, ...fallbackFlags])];
      console.log("Combined flags with fallback:", combinedFlags);
      setDiscoveredFlags(combinedFlags);
    }

    // Initial terminal boot sequence
    setTimeout(
      () => addTerminalLine("Microsoft Windows [Version 10.0.19045.3570]"),
      500
    );
    setTimeout(
      () => addTerminalLine("(c) Microsoft Corporation. All rights reserved."),
      1000
    );
    setTimeout(() => addTerminalLine(""), 1500);
    setTimeout(
      () =>
        addTerminalLine("Remote connection established to: PROF-RAMIREZ-PC"),
      2000
    );
    setTimeout(() => addTerminalLine("User: Professor"), 2500);
    setTimeout(() => addTerminalLine(""), 3000);
    setTimeout(
      () =>
        addTerminalLine(
          "You are now connected to Professor Ramirez's computer."
        ),
      3500
    );
    setTimeout(
      () =>
        addTerminalLine(
          "Navigate through the file system to find clues about his whereabouts."
        ),
      4000
    );
    setTimeout(
      () =>
        addTerminalLine(
          "Use the flags you collected from previous rooms to access secured files."
        ),
      4500
    );
    setTimeout(() => addTerminalLine(""), 5000);
    setTimeout(
      () => addTerminalLine("Type 'help' for available commands"),
      5500
    );
    setTimeout(() => addTerminalLine(""), 6000);
  }, [setCurrentRoom, clues, hasInitialized, addTerminalLine]);

  // Command processing
  const processCommand = async () => {
    if (!currentInput.trim()) return;

    setIsProcessing(true);
    addTerminalLine(`${currentDirectory}>${currentInput}`);

    const command = currentInput.trim();

    setTimeout(() => {
      if (
        command.toLowerCase() === "clear" ||
        command.toLowerCase() === "cls"
      ) {
        setTerminalLines([]);
      } else {
        commandProcessor.processCommand(command);
      }
      setCurrentInput("");
      setIsProcessing(false);
    }, 800);
  };

  // Handle click on terminal to focus input
  const handleTerminalClick = () => {
    // Focus will be handled by TerminalInput component
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-bg"></div>
      </div>

      {/* Navigation and Clues */}
      <RoomNavigation />
      <CluesViewer />
      <FlagsViewer
        discoveredFlags={discoveredFlags}
        authenticatedFlags={authenticatedFlags}
      />

      <div className="relative z-10 min-h-screen p-4">
        {/* Terminal */}
        <div className="max-w-6xl mx-auto">
          <TerminalHeader discoveredFlags={discoveredFlags} />

          {/* Terminal Body */}
          <div
            className="bg-black border-2 border-t-0 border-green-400 rounded-b-lg min-h-[600px] p-4 relative cursor-text"
            onClick={handleTerminalClick}
          >
            <TerminalOutput
              terminalLines={terminalLines}
              isProcessing={isProcessing}
            />
            <TerminalInput
              currentDirectory={currentDirectory}
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
              onSubmit={processCommand}
              isProcessing={isProcessing}
              gameCompleted={gameCompleted}
            />
          </div>

          <GameCompletion gameCompleted={gameCompleted} />
        </div>
      </div>
    </div>
  );
}
