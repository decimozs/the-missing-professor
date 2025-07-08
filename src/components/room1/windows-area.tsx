import { ZipPasswordDialog } from "@/components/room1/zip-password-dialog";
import { ZipUnlockedContent } from "@/components/room1/zip-unlocked-content";
import { LoginActivityLog } from "@/components/room1/login-activity-log";
import { ExpandedStickyNote } from "@/components/room1/expanded-sticky-notes";

interface WindowsAreaProps {
  // ZIP Dialog props
  zipClicked: boolean;
  zipUnlocked: boolean;
  password: string;
  onPasswordChange: (value: string) => void;
  onPasswordSubmit: () => void;
  onZipCancel: () => void;
  attempts: number;
  showHint: boolean;
  encryptedMessage: string;

  // Log props
  showLog: boolean;
  onLogClose: () => void;

  // Sticky note props
  showStickyNote: boolean;
  onStickyNoteClose: () => void;
}

export function WindowsArea({
  zipClicked,
  zipUnlocked,
  password,
  onPasswordChange,
  onPasswordSubmit,
  onZipCancel,
  attempts,
  showHint,
  encryptedMessage,
  showLog,
  onLogClose,
  showStickyNote,
  onStickyNoteClose,
}: WindowsAreaProps) {
  return (
    <div className="col-span-3 space-y-4">
      {/* ZIP Password Dialog */}
      {zipClicked && !zipUnlocked && (
        <ZipPasswordDialog
          password={password}
          onPasswordChange={onPasswordChange}
          onSubmit={onPasswordSubmit}
          onCancel={onZipCancel}
          attempts={attempts}
          showHint={showHint}
        />
      )}

      {/* Unlocked ZIP Contents */}
      {zipUnlocked && (
        <ZipUnlockedContent encryptedMessage={encryptedMessage} />
      )}

      {/* Login Activity Log */}
      {showLog && <LoginActivityLog onClose={onLogClose} />}

      {/* Expanded Sticky Note */}
      {showStickyNote && <ExpandedStickyNote onClose={onStickyNoteClose} />}
    </div>
  );
}
