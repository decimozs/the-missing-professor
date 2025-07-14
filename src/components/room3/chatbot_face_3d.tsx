import { useEffect, useState } from "react";

interface ChatbotFaceProps {
  isTyping: boolean;
  riddleSolved: boolean;
}

export function ChatbotFace({ isTyping, riddleSolved }: ChatbotFaceProps) {
  const [blinkAnimation, setBlinkAnimation] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkAnimation(true);
      setTimeout(() => setBlinkAnimation(false), 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Add keyframes for float animation
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      @keyframes robotFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-8px) rotate(0.5deg); }
        50% { transform: translateY(-5px) rotate(0deg); }
        75% { transform: translateY(-12px) rotate(-0.5deg); }
      }
      .robot-float {
        animation: robotFloat 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* Speech Bubble */}
      {isTyping && (
        <div className="mb-4 relative">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-bl-none shadow-lg animate-bounce">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3D Robot Container with floating animation */}
      <div className="robot-float relative transform transition-transform duration-1000 ease-in-out">
        {/* Robot Main Body */}
        <div className="relative w-64 h-80">
          {/* Robot Head */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32">
            {/* Head Main Shape */}
            <div className="relative w-full h-full">
              {/* Head Body - White/Gray gradient */}
              <div className="w-full h-full bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-2xl shadow-2xl border-2 border-gray-300">
                {/* Screen Face */}
                <div className="absolute inset-2 bg-gradient-to-b from-gray-800 to-black rounded-xl overflow-hidden">
                  {/* Eyes */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full transition-all duration-200 ${
                        blinkAnimation ? "h-1" : "h-6"
                      } ${
                        riddleSolved ? "bg-green-400" : "bg-cyan-400"
                      } shadow-lg`}
                      style={{ boxShadow: "0 0 20px currentColor" }}
                    />
                    <div
                      className={`w-6 h-6 rounded-full transition-all duration-200 ${
                        blinkAnimation ? "h-1" : "h-6"
                      } ${
                        riddleSolved ? "bg-green-400" : "bg-cyan-400"
                      } shadow-lg`}
                      style={{ boxShadow: "0 0 20px currentColor" }}
                    />
                  </div>

                  {/* Mouth */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                    {riddleSolved ? (
                      // Happy mouth - curved line
                      <div className="w-12 h-6 border-b-4 border-green-400 rounded-b-full shadow-lg" />
                    ) : isTyping ? (
                      // Speaking mouth - animated oval
                      <div className="relative">
                        <div className="w-8 h-4 bg-cyan-400 rounded-full animate-pulse shadow-lg" />
                        <div className="absolute inset-0 w-8 h-4 bg-cyan-300 rounded-full animate-ping opacity-75" />
                      </div>
                    ) : (
                      // Neutral mouth - small line
                      <div className="w-8 h-1 bg-cyan-400 rounded-full shadow-lg" />
                    )}
                  </div>

                  {/* Screen Scan Lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-px bg-cyan-400 absolute top-1/4 animate-pulse" />
                    <div
                      className="w-full h-px bg-cyan-400 absolute top-2/4 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="w-full h-px bg-cyan-400 absolute top-3/4 animate-pulse"
                      style={{ animationDelay: "1s" }}
                    />
                  </div>
                </div>

                {/* Head Side Details */}
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-l-lg shadow-md" />
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gradient-to-l from-gray-400 to-gray-500 rounded-r-lg shadow-md" />
              </div>
            </div>
          </div>

          {/* Robot Body */}
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-40 h-32">
            <div className="w-full h-full bg-gradient-to-b from-gray-100 via-white to-gray-200 rounded-2xl shadow-2xl border-2 border-gray-300">
              {/* Chest Panel */}
              <div className="absolute inset-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg border border-gray-400">
                {/* Power Indicator */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      riddleSolved ? "bg-green-400" : "bg-blue-400"
                    } animate-pulse shadow-lg`}
                  />
                </div>

                {/* Status Lights */}
                <div className="absolute bottom-2 left-2 flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full opacity-75" />
                  <div className="w-2 h-2 bg-blue-300 rounded-full opacity-50" />
                  <div className="w-2 h-2 bg-blue-200 rounded-full opacity-25" />
                </div>

                {/* Center Logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-blue-600 font-bold text-sm">E.R.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Robot Arms */}
          <div className="absolute top-32 -left-8 w-6 h-24 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full shadow-lg transform rotate-12" />
          <div className="absolute top-32 -right-8 w-6 h-24 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full shadow-lg transform -rotate-12" />

          {/* Robot Hands */}
          <div className="absolute top-52 -left-10 w-8 h-8 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full shadow-lg" />
          <div className="absolute top-52 -right-10 w-8 h-8 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full shadow-lg" />

          {/* Robot Lower Body */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20">
            <div className="w-full h-full bg-gradient-to-b from-white via-gray-100 to-gray-200 rounded-b-2xl shadow-2xl border-2 border-gray-300">
              {/* Base Details */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <div
                  className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                />
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                />
              </div>
            </div>
          </div>

          {/* Floating Particles */}
          {riddleSolved && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-1 h-1 bg-green-400 rounded-full animate-ping" />
              <div
                className="absolute top-8 right-6 w-1 h-1 bg-green-300 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute bottom-12 left-8 w-1 h-1 bg-green-400 rounded-full animate-ping"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute bottom-16 right-4 w-1 h-1 bg-green-300 rounded-full animate-ping"
                style={{ animationDelay: "1.5s" }}
              />
            </div>
          )}
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/20 rounded-full blur-lg" />
      </div>

      {/* Status Text */}
      <div className="text-center mt-6">
        <p
          className={`text-lg font-semibold ${
            riddleSolved ? "text-green-300" : "text-cyan-300"
          }`}
        >
          {riddleSolved ? "✓ E.R. ACTIVATED" : "E.R. STANDBY MODE"}
        </p>
        {isTyping && (
          <p className="text-sm text-blue-300 mt-1 animate-pulse">
            Processing response...
          </p>
        )}
      </div>
    </div>
  );
}
