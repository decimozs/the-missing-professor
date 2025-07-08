import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ExpandedStickyNoteProps {
  onClose: () => void;
}

export function ExpandedStickyNote({ onClose }: ExpandedStickyNoteProps) {
  return (
    <Card className="bg-yellow-100 border-yellow-400 border-2 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-black font-mono text-lg">
          📝 Professor's Personal Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-black space-y-2">
          <p>
            <strong>Personal Info:</strong>
          </p>
          <p>• Born in the year of the moon landing (1969? 1968?)</p>
          <p>• Full name: Eladio Ramirez</p>
          <p>• Username: eladio.ramirez</p>
          <p className="text-gray-600 text-sm mt-4">
            💭 Note: Professor was known for using predictable password
            patterns...
          </p>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="mt-4 border-yellow-600 text-yellow-800 hover:bg-yellow-200"
        >
          CLOSE NOTE
        </Button>
      </CardContent>
    </Card>
  );
}
