interface ZipFileIconProps {
  zipUnlocked: boolean;
  onClick: () => void;
}

export function ZipFileIcon({ zipUnlocked, onClick }: ZipFileIconProps) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer hover:bg-blue-800/30 p-4 rounded pixel-art"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center mb-2 relative">
        <span className="text-black font-bold text-xs">ZIP</span>
        {!zipUnlocked && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border border-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🔒</span>
          </div>
        )}
      </div>
      <span className="text-green-300 text-xs text-center">
        research_data.zip
      </span>
      {zipUnlocked && (
        <span className="text-green-400 text-xs">UNLOCKED!</span>
      )}
    </div>
  );
}
