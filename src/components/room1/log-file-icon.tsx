interface LogFileIconProps {
  onClick: () => void;
}

export function LogFileIcon({ onClick }: LogFileIconProps) {
  return (
    <div
      className="flex flex-col items-center cursor-pointer hover:bg-blue-800/30 p-4 rounded pixel-art"
      onClick={onClick}
    >
      <div className="w-16 h-16 bg-green-600 border-2 border-green-700 flex items-center justify-center mb-2">
        <span className="text-white font-bold text-xs">LOG</span>
      </div>
      <span className="text-green-300 text-xs text-center">access.log</span>
    </div>
  );
}
