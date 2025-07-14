import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { RoomNavigation } from "@/components/room_navigation";
import { CluesViewer } from "@/components/clues_viewer";

export const Route = createFileRoute("/rooms/room4")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { addClue, setCurrentRoom } = useGameStore();

  // State for various desk items and interactions
  const [photoClicked, setPhotoClicked] = useState(false);
  const [notebookClicked, setNotebookClicked] = useState(false);
  const [computerClicked, setComputerClicked] = useState(false);
  const [decodedMessage, setDecodedMessage] = useState("");
  const [showDecoder, setShowDecoder] = useState(false);
  const [showExitDoor, setShowExitDoor] = useState(false);
  const [doorInput, setDoorInput] = useState("");
  const [doorError, setDoorError] = useState("");

  // Decoder state
  const [userEncodedInput, setUserEncodedInput] = useState("");
  const [selectedEncoding, setSelectedEncoding] = useState("base64");
  const [decodingError, setDecodingError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [collectedCodes, setCollectedCodes] = useState<string[]>([]);

  // The hidden Base64 message - encodes "Professor_USF_24"
  const hiddenBase64 = "UHJvZmVzc29yX1VTRl8yNA==";

  // Different encoding options for the challenge
  const encodingOptions = [
    { value: "base64", label: "Base64" },
    { value: "hex", label: "Hexadecimal" },
    { value: "binary", label: "Binary" },
    { value: "ascii", label: "ASCII" },
    { value: "rot13", label: "ROT13" },
  ];

  useEffect(() => {
    setCurrentRoom("room4");
  }, [setCurrentRoom]);

  const handlePhotoClick = () => {
    if (!photoClicked) {
      setPhotoClicked(true);

      // Add the encoded string to collected codes
      if (!collectedCodes.includes(hiddenBase64)) {
        setCollectedCodes((prev) => [...prev, hiddenBase64]);
      }

      addClue({
        id: "room4-photo-metadata",
        title: "Lab Photo - Encoded Message",
        content: `Found encoded text on photo back: "${hiddenBase64}" - Try copying this into a decoder tool.`,
        foundAt: "Desk Photo",
        roomId: "room4",
      });

      // Copy to clipboard
      navigator.clipboard
        .writeText(hiddenBase64)
        .then(() => {
          console.log("Encoded text copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    }
  };

  const handleNotebookClick = () => {
    if (!notebookClicked) {
      setNotebookClicked(true);
      setShowDecoder(true);
      addClue({
        id: "room4-notebook-hint",
        title: "Research Notebook - Encoding Clue",
        content:
          "Page 64: 'Professor preferred Base64 encoding for secure data transmission. The lab standard since 2020. Always check encoding type before decoding!'",
        foundAt: "Research Notebook",
        roomId: "room4",
      });
    }
  };

  const handleComputerClick = () => {
    if (!computerClicked) {
      setComputerClicked(true);
      addClue({
        id: "room4-computer-hint",
        title: "Computer Terminal - Browser History",
        content:
          "Recent searches: 'Base64 decoder online', 'how to decode base64', 'encoding types comparison'. Bookmarks: Multi-Encoder Tool v2.1",
        foundAt: "Computer",
        roomId: "room4",
      });
    }
  };

  const handleDecode = () => {
    setDecodingError("");
    setShowSuccess(false);

    if (!userEncodedInput.trim()) {
      setDecodingError("Please enter an encoded string to decode.");
      return;
    }

    try {
      let decoded = "";

      switch (selectedEncoding) {
        case "base64":
          decoded = atob(userEncodedInput.trim());
          break;
        case "hex":
          // Hex to ASCII conversion
          decoded = userEncodedInput.trim().replace(/[^0-9A-Fa-f]/g, "");
          if (decoded.length % 2 !== 0) throw new Error("Invalid hex format");
          decoded =
            decoded
              .match(/.{1,2}/g)
              ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
              .join("") || "";
          break;
        case "binary": { // Binary to ASCII conversion
          const binaryClean = userEncodedInput.trim().replace(/[^01]/g, "");
          if (binaryClean.length % 8 !== 0)
            throw new Error("Invalid binary format");
          decoded =
            binaryClean
              .match(/.{1,8}/g)
              ?.map((byte) => String.fromCharCode(parseInt(byte, 2)))
              .join("") || "";
          break;
        }
        case "ascii": { // ASCII values to text
          const asciiNumbers = userEncodedInput
            .trim()
            .split(/[\s,]+/)
            .filter((n) => n);
          decoded = asciiNumbers
            .map((num) => String.fromCharCode(parseInt(num)))
            .join("");
          break;
        }
        case "rot13":
          // ROT13 decoding
          decoded = userEncodedInput.trim().replace(/[A-Za-z]/g, (char) => {
            const start = char <= "Z" ? 65 : 97;
            return String.fromCharCode(
              ((char.charCodeAt(0) - start + 13) % 26) + start
            );
          });
          break;
        default:
          throw new Error("Unknown encoding type");
      }

      // Check if this is the correct answer
      if (decoded === "Professor_USF_24") {
        setDecodedMessage(decoded);
        setShowExitDoor(true);
        setShowSuccess(true);
        addClue({
          id: "room4-final-password",
          title: "Final Password - DECODED!",
          content: `Successfully decoded using ${encodingOptions.find((opt) => opt.value === selectedEncoding)?.label}: "${decoded}" - This is the final password!`,
          foundAt: "Multi-Encoder Tool",
          roomId: "room4",
        });

        // Clear any previous errors
        setDecodingError("");
      } else {
        setDecodingError(
          `Decoded result: "${decoded}" - This doesn't look like the correct password. Try a different encoding method or check your input.`
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setDecodingError(
        `Decoding failed with ${encodingOptions.find((opt) => opt.value === selectedEncoding)?.label}. Check your input format or try a different encoding type.`
      );
    }
  };

  const handleExitDoorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = doorInput.trim();

    if (
      normalizedInput === "Professor_USF_24" ||
      normalizedInput === decodedMessage
    ) {
      setDoorError("");
      // Navigate to final room (room 5 or completion screen)
      navigate({ to: "/rooms/room5" });
    } else {
      setDoorError("INCORRECT PASSWORD");
      setDoorInput("");
      setTimeout(() => setDoorError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 text-gray-800 relative overflow-hidden">
      {/* Vintage paper texture overlay */}
      <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-yellow-100 to-amber-200" />

      {/* Navigation and Clues */}
      <RoomNavigation />
      <CluesViewer />

      <div className="relative z-10 min-h-screen p-4">
        {/* Room Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-amber-800 drop-shadow-lg">
            The Cluttered Desk
          </h1>
          <p className="text-amber-700 text-lg">"Hidden in Plain Sight"</p>
        </div>

        {/* Extremely Cluttered Office Desk - Realistic Style */}
        <div className="max-w-7xl mx-auto">
          <div
            className="relative min-h-[600px] bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 rounded-none p-2 shadow-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #78350f 0%, #92400e 25%, #a16207 50%, #92400e 75%, #78350f 100%)",
              backgroundSize: "200px 200px",
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px)",
            }}
          >
            {/* Extreme Paper Chaos - Layer 1 (Back) */}
            <div className="absolute top-8 left-4 w-40 h-28 bg-white shadow-lg transform rotate-45 opacity-90">
              <div className="p-2 text-xs text-gray-700">
                <div className="font-bold">RESEARCH PROPOSAL</div>
                <div className="text-xs">Quantum encryption methods...</div>
                <div className="text-xs">Status: CLASSIFIED</div>
              </div>
            </div>

            <div className="absolute top-12 left-32 w-36 h-24 bg-yellow-50 shadow-lg transform -rotate-12 opacity-80">
              <div className="p-2 text-xs">
                <div className="font-bold text-red-600">URGENT - DEADLINE</div>
                <div className="text-gray-600">Submit by EOD...</div>
              </div>
            </div>

            <div className="absolute top-20 left-60 w-32 h-20 bg-blue-50 shadow-lg transform rotate-24 opacity-85">
              <div className="p-2 text-xs text-blue-800">
                <div className="font-semibold">Lab Results</div>
                <div>Sample A-47: POSITIVE</div>
                <div>Contamination: 0.02%</div>
              </div>
            </div>

            {/* More Paper Chaos - Layer 2 */}
            <div className="absolute top-32 left-8 w-44 h-32 bg-green-50 shadow-lg transform -rotate-6 opacity-90">
              <div className="p-3 text-xs text-green-800">
                <div className="font-bold">SAFETY PROTOCOL</div>
                <div className="mt-1">□ Gloves required</div>
                <div>□ Ventilation check</div>
                <div>□ Emergency exits clear</div>
                <div className="text-red-600 font-bold mt-2">
                  VIOLATION = DISMISSAL
                </div>
              </div>
            </div>

            <div className="absolute top-28 right-12 w-38 h-26 bg-pink-50 shadow-lg transform rotate-18 opacity-75">
              <div className="p-2 text-xs text-purple-700">
                <div className="font-semibold">Personal Notes</div>
                <div>Remember: Check encryption keys</div>
                <div>Password changed last week</div>
                <div>New format: Name_Org_Year</div>
              </div>
            </div>

            {/* Books and Journals Stacked Chaotically */}
            <div className="absolute top-16 right-24 w-28 h-40 bg-red-800 shadow-lg transform -rotate-8">
              <div className="p-2 text-white text-xs">
                <div className="font-bold">CRYPTOGRAPHY</div>
                <div className="text-xs mt-1">Advanced Methods</div>
                <div className="text-xs">3rd Edition</div>
              </div>
            </div>

            <div className="absolute top-24 right-32 w-32 h-36 bg-blue-800 shadow-lg transform rotate-15">
              <div className="p-2 text-white text-xs">
                <div className="font-bold">SECURITY</div>
                <div className="font-bold">PROTOCOLS</div>
                <div className="text-xs mt-2">Vol. 12</div>
                <div className="text-xs">Dr. Martinez</div>
              </div>
            </div>

            {/* Lab Photo BURIED under papers - More Hidden */}
            <div
              className="absolute top-40 left-44 w-36 h-28 bg-white shadow-xl transform rotate-8 cursor-pointer hover:scale-105 transition-transform border-2 border-white z-10"
              onClick={handlePhotoClick}
              style={{ zIndex: photoClicked ? 30 : 10 }}
            >
              <div className="w-full h-20 bg-gradient-to-br from-blue-300 to-purple-400 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl">🔬</div>
                  <div className="text-xs text-gray-700">USF Lab Team</div>
                </div>
              </div>
              <div className="p-1 text-xs text-center text-gray-600 font-semibold">
                {photoClicked
                  ? "Encoded string found! (Copied to clipboard)"
                  : "Photo partially visible"}
              </div>
              {photoClicked && (
                <div className="absolute -bottom-8 -left-2 right-0 bg-yellow-300 border-2 border-red-500 rounded p-2 text-xs text-center font-mono text-red-700 z-40 animate-pulse">
                  <div className="font-bold">ENCODED MESSAGE:</div>
                  <div
                    className="bg-white p-1 rounded mt-1 cursor-pointer select-all"
                    onClick={() => navigator.clipboard.writeText(hiddenBase64)}
                    title="Click to copy"
                  >
                    {hiddenBase64}
                  </div>
                  <div className="text-xs mt-1">
                    Click to copy • Use in decoder tool
                  </div>
                </div>
              )}
            </div>

            {/* Paper covering part of photo */}
            <div className="absolute top-45 left-52 w-24 h-16 bg-white shadow-lg transform -rotate-12 opacity-80">
              <div className="p-1 text-xs text-gray-600">
                <div className="font-bold">MEMO</div>
                <div>All files encrypted</div>
              </div>
            </div>

            {/* Research Notebook BURIED */}
            <div
              className="absolute bottom-32 left-8 w-32 h-24 bg-indigo-900 shadow-xl transform -rotate-20 cursor-pointer hover:scale-105 transition-transform z-5"
              onClick={handleNotebookClick}
            >
              <div className="p-2 text-white text-xs">
                <div className="font-bold">RESEARCH LOG</div>
                <div className="text-xs mt-1">Dr. Ramirez</div>
                <div className="text-xs">Vol. 3</div>
                {notebookClicked && (
                  <div className="absolute -bottom-4 left-0 right-0 bg-cyan-200 text-black p-1 rounded text-xs z-30">
                    Page 64: "Base64 = ASCII encoding"
                  </div>
                )}
              </div>
            </div>

            {/* Papers covering notebook */}
            <div className="absolute bottom-36 left-12 w-28 h-20 bg-orange-100 shadow-lg transform rotate-25 opacity-70">
              <div className="p-2 text-xs text-orange-800">
                <div className="font-bold">EXPENSE REPORT</div>
                <div>Equipment: $12,450</div>
              </div>
            </div>

            {/* Computer Monitor with papers around it */}
            <div
              className="absolute bottom-20 right-8 w-52 h-36 bg-gray-900 shadow-2xl cursor-pointer hover:scale-105 transition-transform z-10"
              onClick={handleComputerClick}
            >
              <div className="bg-black p-1 flex justify-between items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-white text-xs">Terminal</div>
              </div>
              <div className="p-4 text-green-400 font-mono text-xs bg-black h-full">
                <div>$ Last login: Thu Dec 19 14:23</div>
                <div>$ Sessions: 47 active</div>
                <div className="text-yellow-400">
                  $ Warning: Unencrypted files detected
                </div>
                {computerClicked && (
                  <div className="text-cyan-400 animate-pulse">
                    $ Bookmark saved: Base64-Decoder-Tool.exe
                  </div>
                )}
              </div>
            </div>

            {/* More scattered items */}
            <div className="absolute top-52 left-20 w-16 h-20 bg-amber-700 shadow-lg transform rotate-45">
              <div className="p-2 text-white text-xs">
                <div className="font-bold">USB</div>
                <div className="text-xs">BACKUP</div>
              </div>
            </div>

            {/* Coffee mug with ring stains */}
            <div className="absolute top-60 right-40 w-14 h-18 bg-white shadow-lg">
              <div className="w-full h-12 bg-gradient-to-b from-amber-800 to-amber-900"></div>
              <div className="absolute -right-2 top-4 w-3 h-6 border-2 border-gray-300"></div>
              <div className="absolute -bottom-2 -left-2 w-18 h-18 border border-amber-300 rounded-full opacity-30"></div>
            </div>

            {/* Pen holder with scattered pens */}
            <div className="absolute bottom-48 left-64 w-12 h-16 bg-gray-700 shadow-lg transform -rotate-8">
              <div className="absolute -top-6 left-1 w-1 h-10 bg-blue-600 transform rotate-12"></div>
              <div className="absolute -top-4 left-4 w-1 h-8 bg-red-600 transform -rotate-6"></div>
              <div className="absolute -top-5 left-7 w-1 h-9 bg-green-600 transform rotate-24"></div>
              <div className="absolute -top-3 left-10 w-1 h-7 bg-purple-600 transform -rotate-12"></div>
            </div>

            {/* Reference Manual with Base64 hint */}
            <div
              className="absolute top-48 right-48 w-36 h-28 bg-gray-200 shadow-lg transform rotate-12 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                addClue({
                  id: "room4-manual-hint",
                  title: "Encoding Reference Manual",
                  content:
                    "Chapter 6: 'Base64 is the preferred encoding for academic institutions. Standard format: letters, numbers, +, / and = padding. Other methods like hex and binary are outdated for secure transmission.'",
                  foundAt: "Reference Manual",
                  roomId: "room4",
                });
              }}
            >
              <div className="p-2 text-xs text-gray-800">
                <div className="font-bold">ENCODING</div>
                <div className="font-bold">REFERENCE</div>
                <div className="text-xs mt-1">5th Edition</div>
                <div className="text-xs">Ch.6: Base64</div>
              </div>
            </div>

            {/* Post-it note with Base64 reminder */}
            <div
              className="absolute bottom-40 right-64 w-20 h-20 bg-yellow-300 shadow-lg transform -rotate-15 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => {
                addClue({
                  id: "room4-postit-hint",
                  title: "Sticky Note Reminder",
                  content:
                    "Handwritten note: 'Remember: Always use Base64 for lab data! Other encodings cause errors. - E.R.'",
                  foundAt: "Sticky Note",
                  roomId: "room4",
                });
              }}
            >
              <div className="p-1 text-xs text-gray-800 font-handwriting">
                <div className="font-bold">REMINDER:</div>
                <div className="text-xs mt-1">Use Base64</div>
                <div className="text-xs">for lab data!</div>
                <div className="text-xs mt-1">- E.R.</div>
              </div>
            </div>

            <div className="absolute bottom-60 right-52 w-20 h-8 bg-yellow-400 shadow-lg transform -rotate-15">
              <div className="p-1 text-xs text-black font-bold text-center">
                HIGHLIGHTER
              </div>
            </div>

            {/* Multi-Encoder Tool (appears after notebook hint) */}
            {showDecoder && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 border-4 border-blue-500 z-20 max-w-md w-full">
                <h3 className="text-lg font-bold text-blue-600 mb-4 text-center">
                  🔧 Multi-Encoder Tool v2.1
                </h3>

                {/* Collected Codes Display */}
                {collectedCodes.length > 0 && (
                  <div className="mb-4 p-3 bg-gray-100 rounded border">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      📋 Collected Encoded Strings:
                    </div>
                    {collectedCodes.map((code, index) => (
                      <div key={index} className="mb-1">
                        <span
                          className="font-mono text-xs bg-yellow-200 px-2 py-1 rounded cursor-pointer"
                          onClick={() => setUserEncodedInput(code)}
                          title="Click to use in decoder"
                        >
                          {code}
                        </span>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-1">
                      💡 Click any code to use in decoder
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Encoding Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Encoding Type:
                    </label>
                    <select
                      value={selectedEncoding}
                      onChange={(e) => setSelectedEncoding(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                    >
                      {encodingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Input Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Encoded String:
                    </label>
                    <textarea
                      value={userEncodedInput}
                      onChange={(e) => setUserEncodedInput(e.target.value)}
                      placeholder="Paste or type encoded string here..."
                      className="w-full p-2 border border-gray-300 rounded bg-white font-mono text-sm h-20 resize-none"
                    />
                  </div>

                  {/* Decode Button */}
                  <button
                    onClick={handleDecode}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                  >
                    🔍 Decode Message
                  </button>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-100 border-2 border-green-400 rounded p-3 animate-pulse">
                      <div className="font-bold text-green-800 text-center">
                        ✅ DECODING SUCCESSFUL!
                      </div>
                      <div className="font-mono text-lg text-green-600 text-center bg-white p-2 rounded mt-2">
                        {decodedMessage}
                      </div>
                      <div className="text-center text-green-700 text-sm mt-2">
                        This appears to be the final password!
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {decodingError && (
                    <div className="bg-red-100 border border-red-400 rounded p-3">
                      <div className="font-semibold text-red-800">
                        ❌ Decoding Failed:
                      </div>
                      <div className="text-red-600 text-sm mt-1">
                        {decodingError}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exit Door (appears after successful decoding) */}
            {showExitDoor && (
              <div className="absolute bottom-4 right-4 bg-gray-800 border-2 border-green-400 rounded-lg p-4 z-20">
                <div className="text-center mb-3">
                  <h3 className="text-green-400 font-bold text-lg">
                    🚪 EXIT DOOR
                  </h3>
                  <div className="text-green-300 text-sm">
                    Enter Final Password
                  </div>
                </div>
                <form onSubmit={handleExitDoorSubmit}>
                  <input
                    type="text"
                    value={doorInput}
                    onChange={(e) => setDoorInput(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full p-2 border border-green-400 rounded bg-black text-green-400 font-mono text-center mb-3"
                  />
                  {doorError && (
                    <div className="text-red-400 text-sm text-center mb-2 animate-pulse">
                      {doorError}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    🔓 UNLOCK EXIT
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <div className="bg-amber-100 border border-amber-400 rounded-lg p-4 inline-block">
            <p className="text-amber-800 text-sm">
              💡 <strong>Explore the desk:</strong> Click on items to examine
              them for clues and hidden information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
