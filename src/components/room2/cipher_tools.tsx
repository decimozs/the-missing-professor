import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CipherToolsProps {
  shiftValue: number;
  onShiftChange: (value: number) => void;
  onSubmit: () => void;
  attempts: number;
  showHint: boolean;
  messageDecoded: boolean;
}

export function CipherTools({
  shiftValue,
  onShiftChange,
  onSubmit,
  attempts,
  showHint,
  messageDecoded,
}: CipherToolsProps) {
  const [manualShift, setManualShift] = useState("");
  const [analysisMode, setAnalysisMode] = useState(false);
  const [showFrequencyHint, setShowFrequencyHint] = useState(false);

  const handleManualSubmit = () => {
    const shift = parseInt(manualShift);
    if (!isNaN(shift) && shift >= 0 && shift <= 25) {
      onShiftChange(shift);
      setManualShift("");
    }
  };

  const handleFrequencyAnalysis = () => {
    setAnalysisMode(true);
    setShowFrequencyHint(true);
  };

  return (
    <div className="bg-gray-900 border border-green-400 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-sm font-semibold">CAESAR CIPHER TOOLS</span>
      </div>

      <div className="space-y-4">
        {/* Manual shift input for more challenge */}
        <div>
          <label className="text-green-400 text-sm block mb-2">
            Enter Shift Value (0-25):
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="0"
              max="25"
              value={manualShift}
              onChange={(e) => setManualShift(e.target.value)}
              placeholder="Enter shift..."
              className="flex-1 bg-gray-800 border border-green-600 rounded px-3 py-2 text-green-400 text-sm focus:outline-none focus:border-green-400"
            />
            <Button
              onClick={handleManualSubmit}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Current shift display */}
        <div className="text-green-400 text-sm">
          Current Shift: <span className="font-mono text-lg">{shiftValue}</span>
        </div>

        {/* Frequency analysis button */}
        {!analysisMode && attempts >= 2 && (
          <Button
            onClick={handleFrequencyAnalysis}
            variant="outline"
            size="sm"
            className="w-full bg-gray-800 text-blue-400 border-blue-400 hover:bg-blue-800"
          >
            🔍 Perform Frequency Analysis
          </Button>
        )}

        {/* Quick select buttons (only show after frequency analysis) */}
        {analysisMode && (
          <div>
            <label className="text-green-400 text-sm block mb-2">Quick Select (Most Common Shifts):</label>
            <div className="grid grid-cols-6 gap-1 text-xs">
              {[1, 3, 5, 7, 13, 23].map((shift) => (
                <Button
                  key={shift}
                  variant={shiftValue === shift ? "default" : "outline"}
                  size="sm"
                  onClick={() => onShiftChange(shift)}
                  className={`h-8 text-xs ${
                    shiftValue === shift
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-green-400 border-green-600 hover:bg-green-800"
                  }`}
                >
                  {shift}
                </Button>
              ))}
            </div>
            <div className="text-yellow-400 text-xs mt-1">
              💡 These are the most commonly used shift values in Caesar ciphers
            </div>
          </div>
        )}

        {attempts > 0 && (
          <div className="text-red-400 text-sm">
            Analysis Attempts: {attempts}/5
          </div>
        )}

        {showHint && (
          <div className="bg-yellow-900 border border-yellow-400 rounded p-3 text-yellow-300 text-sm">
            💡 Hint: Look for the letter 'E' - it's the most common letter in English. In the cipher, it might appear as 'B' (shift 23).
          </div>
        )}

        {showFrequencyHint && (
          <div className="bg-blue-900 border border-blue-400 rounded p-3 text-blue-300 text-sm">
            🔬 Frequency Analysis: Count how often each letter appears. The most frequent letter in the decrypted text should be 'E'.
          </div>
        )}

        <Button
          onClick={onSubmit}
          disabled={messageDecoded}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {messageDecoded ? "✓ DECRYPTED SUCCESSFULLY" : "SUBMIT DECRYPTION"}
        </Button>
      </div>
    </div>
  );
}
