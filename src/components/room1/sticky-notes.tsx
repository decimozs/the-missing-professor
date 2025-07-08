interface StickyNoteProps {
  onClick: () => void;
}

export function StickyNote({ onClick }: StickyNoteProps) {
  return (
    <div
      className="bg-yellow-200 border border-yellow-300 p-3 transform rotate-12 cursor-pointer hover:rotate-6 transition-transform"
      onClick={onClick}
    >
      <div className="text-black text-xs">
        <p className="font-bold">Birthday:</p>
        <p>Born in the year of the</p>
        <p>moon landing...</p>
        <p className="text-gray-600 text-xs mt-1">📝 Click to expand</p>
      </div>
    </div>
  );
}
