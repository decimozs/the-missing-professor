import { useState, useEffect, useRef } from "react";
import { TypingAnimation } from "./typing_animation";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface ChatInterfaceProps {
  messages: Message[];
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: (input: string) => void;
  isTyping: boolean;
  riddleSolved: boolean;
  showFlag: boolean;
}

export function ChatInterface({
  messages,
  userInput,
  setUserInput,
  onSubmit,
  isTyping,
  riddleSolved,
  showFlag,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTypingIndicator]);

  useEffect(() => {
    setShowTypingIndicator(isTyping);
  }, [isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSubmit(userInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const formEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      handleSubmit(formEvent as unknown as React.FormEvent);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Chat Header */}
      <div className="bg-indigo-800/50 border border-indigo-600 rounded-t-lg p-4">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              riddleSolved ? "bg-green-400" : "bg-cyan-400"
            } animate-pulse`}
          />
          <h3 className="text-lg font-semibold text-cyan-300">
            E.R. Emergency Response AI
          </h3>
          <div className="text-xs text-indigo-300">
            {riddleSolved ? "Active" : "Standby"}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="bg-indigo-900/50 border-x border-indigo-600 h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={`${message.timestamp}-${index}`}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? "bg-cyan-600 text-white"
                  : "bg-indigo-700 text-indigo-100 border border-indigo-500"
              }`}
            >
              {message.isUser ? (
                <p className="text-sm">{message.text}</p>
              ) : (
                <TypingAnimation
                  text={message.text}
                  speed={30}
                  className={`text-sm ${
                    message.text.includes("L0C4T1ON_U5B")
                      ? "font-bold text-green-300 bg-green-900/30 px-2 py-1 rounded"
                      : ""
                  }`}
                />
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {showTypingIndicator && (
          <div className="flex justify-start">
            <div className="bg-indigo-700 border border-indigo-500 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-indigo-800/50 border border-indigo-600 rounded-b-lg p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              riddleSolved && showFlag
                ? "E.R. has provided the flag..."
                : riddleSolved
                  ? "Ask E.R. for the location..."
                  : "Type your answer to the riddle..."
            }
            className="flex-1 bg-indigo-700 border border-indigo-500 rounded-lg px-4 py-2 text-indigo-100 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !userInput.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isTyping || !userInput.trim()
                ? "bg-indigo-600 text-indigo-300 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg hover:shadow-cyan-400/25"
            }`}
          >
            Send
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-2 text-xs text-indigo-300">
          {riddleSolved && showFlag ? (
            <span className="text-green-300">
              ✓ Flag received: L0C4T1ON_U5B
            </span>
          ) : riddleSolved ? (
            <span className="text-yellow-300">
              Ask E.R. for the location information
            </span>
          ) : (
            <span>Solve the riddle to unlock E.R.'s knowledge</span>
          )}
        </div>
      </div>
    </div>
  );
}
