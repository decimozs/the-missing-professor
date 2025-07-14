import { useEffect, useState } from "react";

interface ChatbotFaceProps {
  isTyping: boolean;
  riddleSolved: boolean;
}

export function ChatbotFace({ isTyping, riddleSolved }: ChatbotFaceProps) {
  const [blinkAnimation, setBlinkAnimation] = useState(false);
  const [mouthScale, setMouthScale] = useState(1);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkAnimation(true);
      setTimeout(() => setBlinkAnimation(false), 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    let mouthInterval: NodeJS.Timeout;
    if (isTyping) {
      mouthInterval = setInterval(() => {
        setMouthScale((prev) => (prev === 1 ? 1.3 : 1));
      }, 500);
    } else {
      setMouthScale(1);
    }

    return () => {
      if (mouthInterval) clearInterval(mouthInterval);
    };
  }, [isTyping]);

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          .float-animation {
            animation: float ${isTyping ? "2s" : "4s"} ease-in-out infinite;
          }
        `}
      </style>
      <div className="relative flex flex-col items-center">
        {/* Floating Animation Container */}
        <div className="float-animation transition-all duration-1000">
          {/* Robot Head */}
          <div className="relative">
            {/* Head/Helmet */}
            <div className="w-64 h-48 bg-gradient-to-b from-gray-100 to-gray-300 rounded-t-full rounded-b-3xl shadow-2xl border-4 border-gray-200 relative overflow-hidden">
              {/* Screen Face */}
              <div className="absolute inset-4 top-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-slate-600 shadow-inner">
                {/* Screen Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl ${
                    riddleSolved ? "bg-green-500/10" : "bg-cyan-500/10"
                  } animate-pulse`}
                />

                {/* Eyes */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-6">
                  <div
                    className={`w-6 h-6 rounded-full transition-all duration-200 ${
                      blinkAnimation ? "h-1" : "h-6"
                    } ${
                      riddleSolved ? "bg-green-400" : "bg-cyan-400"
                    } shadow-lg`}
                    style={{
                      boxShadow: riddleSolved
                        ? "0 0 20px rgba(74, 222, 128, 0.6)"
                        : "0 0 20px rgba(34, 211, 238, 0.6)",
                    }}
                  />
                  <div
                    className={`w-6 h-6 rounded-full transition-all duration-200 ${
                      blinkAnimation ? "h-1" : "h-6"
                    } ${
                      riddleSolved ? "bg-green-400" : "bg-cyan-400"
                    } shadow-lg`}
                    style={{
                      boxShadow: riddleSolved
                        ? "0 0 20px rgba(74, 222, 128, 0.6)"
                        : "0 0 20px rgba(34, 211, 238, 0.6)",
                    }}
                  />
                </div>

                {/* Mouth */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  {riddleSolved ? (
                    // Happy smile
                    <div className="w-12 h-6 border-b-3 border-green-400 rounded-b-full opacity-80" />
                  ) : (
                    // Speaking mouth with animation
                    <div
                      className={`w-8 h-4 rounded-full border-2 transition-all duration-300 ${
                        riddleSolved ? "border-green-400" : "border-cyan-400"
                      }`}
                      style={{
                        transform: `scale(${mouthScale})`,
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />
                  )}
                </div>

                {/* Screen Lines/Grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent animate-pulse" />
                  <div className="absolute top-0 left-0 w-full h-px bg-cyan-400/40" />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-cyan-400/40" />
                </div>
              </div>

              {/* Helmet Reflections */}
              <div className="absolute top-2 left-4 w-8 h-4 bg-white/30 rounded-full blur-sm" />
              <div className="absolute top-6 right-6 w-4 h-8 bg-white/20 rounded-full blur-sm" />
            </div>

            {/* Ears/Side Components */}
            <div className="absolute top-16 -left-6 w-8 h-16 bg-gradient-to-l from-gray-300 to-gray-100 rounded-l-full border-2 border-gray-200 shadow-lg" />
            <div className="absolute top-16 -right-6 w-8 h-16 bg-gradient-to-r from-gray-300 to-gray-100 rounded-r-full border-2 border-gray-200 shadow-lg" />
          </div>

          {/* Robot Body */}
          <div className="w-48 h-32 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-3xl rounded-t-lg shadow-xl border-4 border-gray-300 relative mt-2">
            {/* Chest Panel */}
            <div className="absolute inset-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-slate-300 shadow-inner">
              {/* Status Indicator */}
              <div
                className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${
                  riddleSolved ? "bg-green-400" : "bg-cyan-400"
                } animate-pulse shadow-lg`}
              />

              {/* AI Label */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <span
                  className={`text-xs font-bold ${
                    riddleSolved ? "text-green-600" : "text-cyan-600"
                  }`}
                >
                  E.R.
                </span>
              </div>
            </div>

            {/* Body Highlights */}
            <div className="absolute top-1 left-4 w-6 h-2 bg-white/40 rounded-full blur-sm" />
            <div className="absolute bottom-1 right-4 w-4 h-2 bg-white/30 rounded-full blur-sm" />
          </div>

          {/* Arms */}
          <div className="absolute top-24 -left-12 w-6 h-20 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full border-2 border-gray-300 shadow-lg transform rotate-12" />
          <div className="absolute top-24 -right-12 w-6 h-20 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full border-2 border-gray-300 shadow-lg transform -rotate-12" />
        </div>

        {/* Speaking Animation Indicators */}
        {isTyping && (
          <div className="flex space-x-1 mt-4">
            <div
              className={`w-2 h-2 rounded-full animate-bounce ${
                riddleSolved ? "bg-green-400" : "bg-cyan-400"
              }`}
              style={{ animationDelay: "0ms" }}
            />
            <div
              className={`w-2 h-2 rounded-full animate-bounce ${
                riddleSolved ? "bg-green-400" : "bg-cyan-400"
              }`}
              style={{ animationDelay: "150ms" }}
            />
            <div
              className={`w-2 h-2 rounded-full animate-bounce ${
                riddleSolved ? "bg-green-400" : "bg-cyan-400"
              }`}
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}

        {/* Shadow */}
        <div className="w-32 h-6 bg-black/20 rounded-full blur-md mt-4 animate-pulse" />

        {/* Status Text */}
        <div className="text-center mt-4">
          <p
            className={`text-sm font-semibold ${
              riddleSolved ? "text-green-300" : "text-cyan-300"
            }`}
          >
            {riddleSolved ? "✓ AI Activated" : "Emergency Response AI"}
          </p>
          {isTyping && (
            <p className="text-xs text-indigo-300 mt-1 animate-pulse">
              E.R. is speaking...
            </p>
          )}
        </div>
      </div>
    </>
  );
}
