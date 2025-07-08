import { ZipFileIcon } from "@/components/room1/zip-file-icon";
import { StickyNote } from "@/components/room1/sticky-notes";
import { LogFileIcon } from "@/components/room1/log-file-icon";

interface DesktopIconsProps {
  zipUnlocked: boolean;
  onZipClick: () => void;
  onStickyNoteClick: () => void;
  onLogClick: () => void;
}

export function DesktopIcons({
  zipUnlocked,
  onZipClick,
  onStickyNoteClick,
  onLogClick,
}: DesktopIconsProps) {
  return (
    <div className="col-span-1 space-y-6">
      <ZipFileIcon zipUnlocked={zipUnlocked} onClick={onZipClick} />
      <StickyNote onClick={onStickyNoteClick} />
      <LogFileIcon onClick={onLogClick} />
    </div>
  );
}
