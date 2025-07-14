import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface GameCompletionProps {
  gameCompleted: boolean;
}

export function GameCompletion({ gameCompleted }: GameCompletionProps) {
  const navigate = useNavigate();
  const [showFlash, setShowFlash] = useState(false);
  const [showProfessorMessage, setShowProfessorMessage] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);

  const professorMessage = `TRANSMISSION DECODED...

Professor Ramirez here.

Congratulations, Agent. I'm genuinely impressed by your cybersecurity skills and determination.

When I discovered the security breach in our AI research lab, I had to go into hiding to protect the sensitive data. I left behind a trail of digital breadcrumbs, hoping someone with your expertise would find me.

Your successful navigation through the encrypted file systems, discovery of authentication flags, and ability to decode my final message proves you have what it takes to join our elite cybersecurity team.

The future is uncertain, but with agents like you protecting our digital world, I have hope.

Welcome to the team, Agent.

- Professor Miguel Ramirez
  University of South Florida
  Cybersecurity Research Division

[TRANSMISSION COMPLETE]`;

  useEffect(() => {
    if (gameCompleted) {
      // Flash sequence
      setTimeout(() => setShowFlash(true), 500);
      setTimeout(() => setShowFlash(false), 1000);

      // Show professor message after flash
      setTimeout(() => setShowProfessorMessage(true), 1200);
    }
  }, [gameCompleted]);

  // Typewriter effect for professor's message
  useEffect(() => {
    if (showProfessorMessage && professorMessage) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < professorMessage.length) {
          setTypewriterText(professorMessage.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setIsTypingComplete(true);
          setTimeout(() => setShowContinuePrompt(true), 1000);
        }
      }, 50); // Typing speed

      return () => clearInterval(timer);
    }
  }, [showProfessorMessage, professorMessage]);

  // Handle key press to return to main menu
  useEffect(() => {
    const handleKeyPress = () => {
      if (isTypingComplete) {
        navigate({ to: "/" });
      }
    };

    if (isTypingComplete) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [isTypingComplete, navigate]);

  if (!gameCompleted) return null;

  return (
    <>
      {/* White Flash Overlay */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-[100] animate-flash"></div>
      )}

      {/* Professor's Message Full Screen */}
      {showProfessorMessage && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8">
          <div className="max-w-4xl w-full">
            <div className="bg-gray-900 border-2 border-green-400 rounded-lg p-8 shadow-2xl glow-green">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-green-400">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-green-400 font-mono text-sm">
                  SECURE_TRANSMISSION.exe - DECRYPTED
                </span>
              </div>

              {/* Message Content */}
              <div className="font-mono text-green-400 leading-relaxed">
                <div className="whitespace-pre-wrap text-lg">
                  {typewriterText}
                  {!isTypingComplete && (
                    <span className="animate-pulse text-green-300">█</span>
                  )}
                </div>

                {/* Completion indicator */}
                {showContinuePrompt && (
                  <div className="mt-8 pt-6 border-t border-green-400 text-center animate-fade-in">
                    <div className="text-green-300 text-sm mb-4 animate-pulse">
                      [ PRESS ANY KEY TO RETURN TO MAIN MENU ]
                    </div>
                    <div className="text-green-500 text-xs">
                      Game completed • {new Date().toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
