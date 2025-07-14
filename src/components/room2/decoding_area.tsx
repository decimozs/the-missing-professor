import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/room2/typing_animation";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

interface DecodingAreaProps {
  encryptedMessage: string;
  decodedMessage: string;
  shiftValue: number;
  messageDecoded: boolean;
  onNextRoom: () => void;
}

export function DecodingArea({
  encryptedMessage,
  decodedMessage,
  shiftValue,
  messageDecoded,
  onNextRoom,
}: DecodingAreaProps) {
  const [showTyping, setShowTyping] = useState(false);
  const [previousMessage, setPreviousMessage] = useState("");
  const { clues } = useGameStore();

  // Check if AI lab notes have been downloaded
  const aiLabNotesClue = clues.find((clue) => clue.id === "room2-ai-lab-notes");

  // Trigger typing animation when decoded message changes
  useEffect(() => {
    if (decodedMessage && decodedMessage !== previousMessage) {
      setShowTyping(true);
      setPreviousMessage(decodedMessage);
    }
  }, [decodedMessage, previousMessage]);

  // Calculate letter frequency for analysis
  const getLetterFrequency = (text: string) => {
    const frequency: { [key: string]: number } = {};
    const letters = text.toUpperCase().replace(/[^A-Z]/g, "");

    for (const letter of letters) {
      frequency[letter] = (frequency[letter] || 0) + 1;
    }

    return frequency;
  };

  const frequency = getLetterFrequency(decodedMessage);
  const totalLetters = Object.values(frequency).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get top 5 most frequent letters
  const topLetters = Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-gray-900 border border-green-400 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-sm font-semibold">
          DECRYPTION OUTPUT
        </span>
      </div>

      <div className="space-y-4">
        {/* Original message */}
        <div>
          <label className="text-green-400 text-xs block mb-2">
            ENCRYPTED (SHIFT: {shiftValue}):
          </label>
          <div className="bg-black border border-gray-600 rounded p-3 font-mono text-xs">
            <div className="text-red-400 break-all">{encryptedMessage}</div>
          </div>
        </div>

        {/* Decoded message with typing animation */}
        <div>
          <label className="text-green-400 text-xs block mb-2">
            DECRYPTED OUTPUT:
          </label>
          <div className="bg-black border border-gray-600 rounded p-3 font-mono text-xs min-h-[100px]">
            {decodedMessage ? (
              <div
                className={`break-all ${messageDecoded ? "text-green-400" : "text-yellow-400"}`}
              >
                {showTyping ? (
                  <TypingAnimation
                    text={decodedMessage}
                    speed={30}
                    onComplete={() => setShowTyping(false)}
                  />
                ) : (
                  decodedMessage
                )}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Enter a shift value to see the decoded message...
              </div>
            )}
          </div>
        </div>

        {/* Enhanced frequency analysis */}
        {decodedMessage && (
          <div>
            <label className="text-green-400 text-xs block mb-2">
              FREQUENCY ANALYSIS:
            </label>
            <div className="bg-black border border-gray-600 rounded p-3 text-xs">
              {/* Top frequent letters */}
              <div className="mb-3">
                <div className="text-blue-400 mb-2">Most Frequent Letters:</div>
                <div className="flex space-x-4">
                  {topLetters.map(([letter, count]) => {
                    const percentage =
                      totalLetters > 0
                        ? ((count / totalLetters) * 100).toFixed(1)
                        : 0;
                    return (
                      <div key={letter} className="text-center">
                        <div
                          className={`text-lg font-bold ${count > 0 ? "text-green-400" : "text-gray-500"}`}
                        >
                          {letter}
                        </div>
                        <div className="text-xs text-gray-400">{count}</div>
                        <div className="text-xs text-blue-300">
                          {percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Letter frequency grid */}
              <div className="grid grid-cols-13 gap-1 text-center">
                {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
                  const count = frequency[letter] || 0;
                  const isCommon = ["E", "T", "A", "O", "I", "N"].includes(
                    letter
                  );
                  return (
                    <div key={letter} className="text-green-300">
                      <div
                        className={`text-xs ${isCommon ? "text-yellow-400 font-bold" : ""}`}
                      >
                        {letter}
                      </div>
                      <div
                        className={`text-xs ${count > 0 ? "text-green-400" : "text-gray-600"}`}
                      >
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 text-yellow-400 text-xs">
                💡 In English, 'E' is the most common letter (~12%), followed by
                'T', 'A', 'O', 'I', 'N'
              </div>
            </div>
          </div>
        )}

        {messageDecoded && (
          <div className="space-y-3">
            <div className="bg-green-900 border border-green-400 rounded p-3 text-green-300 text-sm">
              ✅ Message successfully decrypted! The shift value was{" "}
              {shiftValue}.
              <br />
              Flag discovered:{" "}
              <span className="font-mono text-green-400">
                LOCATION_AI_TERMINAL
              </span>
            </div>

            {/* File download notification */}
            {aiLabNotesClue && (
              <div className="bg-blue-900 border border-blue-400 rounded p-3 text-blue-300 text-sm">
                📁{" "}
                <span className="text-blue-400 font-bold">
                  File Downloaded:
                </span>{" "}
                AI_LAB_NOTES.txt
                <br />
                <div className="mt-2 p-2 bg-black rounded font-mono text-xs text-green-400">
                  "{aiLabNotesClue.content}"
                </div>
                <div className="mt-1 text-xs text-blue-200">
                  💾 This file has been added to your clues collection.
                </div>
              </div>
            )}

            <Button
              onClick={onNextRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Room 3 →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
