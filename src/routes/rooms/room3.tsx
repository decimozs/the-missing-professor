import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { useGameStore } from "@/stores/gameStore";
import { ChatbotFace } from "@/components/room3/chatbot_face_3d";
import { ChatInterface } from "@/components/room3/chat_interface";
import { RoomNavigation } from "@/components/room_navigation";
import { CluesViewer } from "@/components/clues_viewer";

export const Route = createFileRoute("/rooms/room3")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    addClue,
    room2Progress,
    submitAnswer,
    updateRoom3Progress,
    room3Progress,
  } = useGameStore();

  const riddle =
    "If I am greater than you, I make no sound. But if you solve me, I'll show you around. What am I?";

  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean; timestamp: number }>
  >([]);
  const [riddleSolved, setRiddleSolved] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const addBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(
          (msg) => msg.text === text && !msg.isUser
        );
        if (messageExists) return prev;
        return [...prev, { text, isUser: false, timestamp: Date.now() }];
      });
      setIsTyping(false);
    }, 1500);
  }, []);

  // Initialize state from store on mount only
  useEffect(() => {
    const initializeFromStore = () => {
      if (room3Progress.riddleSolved) {
        setRiddleSolved(true);
      }
      if (room3Progress.flagReceived) {
        setShowFlag(true);
      }
    };

    initializeFromStore();
  }, [room3Progress.riddleSolved, room3Progress.flagReceived]);

  // Handle sequential message display
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);

      setMessages([]);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages([
            {
              text: "Hello, I am E.R., the Emergency Response AI. I have been waiting for someone to wake me up.",
              isUser: false,
              timestamp: Date.now(),
            },
          ]);
          setIsTyping(false);
        }, 2000);
      }, 500);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: "I see you have found the AI_LAB_NOTES. You need to solve my riddle to proceed.",
              isUser: false,
              timestamp: Date.now(),
            },
          ]);
          setIsTyping(false);
        }, 2000);
      }, 3000);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: riddle,
              isUser: false,
              timestamp: Date.now(),
            },
          ]);
          setIsTyping(false);
        }, 2000);
      }, 5500);

      if (!room3Progress.chatStarted) {
        updateRoom3Progress({ chatStarted: true });
      }
    }
  }, [hasInitialized, riddle, room3Progress.chatStarted, updateRoom3Progress]);

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { text, isUser: true, timestamp: Date.now() },
    ]);
  };

  const handleUserSubmit = (input: string) => {
    if (!input.trim()) return;

    addUserMessage(input);
    setUserInput("");

    const normalizedInput = input.trim().toLowerCase();

    if (riddleSolved && showFlag) {
      addBotMessage("You have already received the flag. Use it wisely.");
      return;
    }

    if (riddleSolved && !showFlag) {
      addBotMessage("Excellent! Here is the flag you seek:");
      setTimeout(() => {
        addBotMessage("L0C4T1ON_U5B.");
        setShowFlag(true);
        submitAnswer("ai-riddle", "SILENCE");
        updateRoom3Progress({ flagReceived: true });
        addClue({
          id: "room3-flag",
          title: "Location Flag",
          content: "L0C4T1ON_U5B.",
          foundAt: "AI Chatbot E.R.",
          roomId: "room3",
        });
      }, 2000);
      return;
    }

    // Check for correct answer
    if (normalizedInput === "silence") {
      setRiddleSolved(true);
      updateRoom3Progress({ riddleSolved: true, attempts: 1 });
      addBotMessage(
        "Correct! Silence is indeed greater than sound, yet makes no noise itself."
      );
      setTimeout(() => {
        addBotMessage(
          "You have solved my riddle. I will now provide you with the information you seek."
        );
      }, 2500);
      return;
    }

    // Handle various incorrect answers with contextual responses
    if (
      normalizedInput.includes("sound") ||
      normalizedInput.includes("noise")
    ) {
      addBotMessage(
        "You're thinking about sound, but the answer itself makes no sound. Try again."
      );
      setTimeout(() => addBotMessage(riddle), 2000);
    } else if (
      normalizedInput.includes("nothing") ||
      normalizedInput.includes("void")
    ) {
      addBotMessage(
        "Close, but not quite. Think about something that exists but cannot be heard."
      );
      setTimeout(() => addBotMessage(riddle), 2000);
    } else if (
      normalizedInput.includes("dark") ||
      normalizedInput.includes("light")
    ) {
      addBotMessage(
        "You're thinking of visual concepts. This riddle is about something auditory."
      );
      setTimeout(() => addBotMessage(riddle), 2000);
    } else if (
      normalizedInput.includes("help") ||
      normalizedInput.includes("hint") ||
      normalizedInput.includes("clue")
    ) {
      addBotMessage(
        "Remember the AI_LAB_NOTES clue: 'speak its first poem. Not a greeting but a riddle.' Think about what is greater than sound but makes none."
      );
    } else {
      // Generic wrong answer
      const responses = [
        "That's not correct. Think carefully about the riddle.",
        "No, that's not the answer I'm looking for.",
        "Incorrect. Consider what could be greater than you but silent.",
        "Not quite right. Focus on the 'makes no sound' part.",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addBotMessage(randomResponse);
      setTimeout(() => addBotMessage(riddle), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-indigo-100 font-mono relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Navigation and Clues */}
      <RoomNavigation />
      <CluesViewer />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-4xl">
          {/* Room Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-cyan-300">
              Library Archives
            </h1>
            <p className="text-indigo-300 text-lg">
              Ancient knowledge awaits in the AI system E.R.
            </p>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Chatbot Face */}
            <div className="flex justify-center">
              <ChatbotFace isTyping={isTyping} riddleSolved={riddleSolved} />
            </div>

            {/* Chat Interface */}
            <div className="w-full">
              <ChatInterface
                messages={messages}
                userInput={userInput}
                setUserInput={setUserInput}
                onSubmit={handleUserSubmit}
                isTyping={isTyping}
                riddleSolved={riddleSolved}
                showFlag={showFlag}
              />
            </div>
          </div>

          {/* Hint Section */}
          {room2Progress.solved && (
            <div className="mt-8 text-center">
              <div className="bg-indigo-800/50 border border-indigo-600 rounded-lg p-4 max-w-md mx-auto">
                <h3 className="text-cyan-300 font-semibold mb-2">
                  💡 Clue from AI_LAB_NOTES
                </h3>
                <p className="text-indigo-200 text-sm">
                  "To wake up E.R speak its first poem. Not a greeting but a
                  riddle."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
