interface DesktopHeaderProps {
  professorName: string;
  currentTime: string;
}

export function DesktopHeader({ professorName, currentTime }: DesktopHeaderProps) {
  return (
    <div className="bg-gray-700 border border-gray-500 p-2 mb-4 flex justify-between items-center">
      <div className="text-white text-sm font-bold">
        Professor {professorName} - Desktop
      </div>
      <div className="text-green-400 text-xs">{currentTime}</div>
    </div>
  );
}
