import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ZipPasswordDialogProps {
  password: string;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  attempts: number;
  showHint: boolean;
}

export function ZipPasswordDialog({
  password,
  onPasswordChange,
  onSubmit,
  onCancel,
  attempts,
  showHint,
}: ZipPasswordDialogProps) {
  return (
    <Card className="bg-gray-800 border-green-500 border-2 neon-glow animate-fade-in">
      <CardHeader className="border-b border-green-500/50">
        <CardTitle className="text-green-400 font-mono text-lg">
          🔒 Password Required - research_data.zip
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-green-300 text-sm">
            This archive is password protected. Enter the password to extract
            files.
          </p>

          {attempts > 0 && (
            <p className="text-red-400 text-sm">
              ❌ Incorrect password. Attempts: {attempts}/3
            </p>
          )}

          {showHint && (
            <div className="bg-yellow-900/20 border border-yellow-500 p-3 text-yellow-300 text-sm">
              💡 Hint: Check the professor's personal information and login
              patterns...
            </div>
          )}

          <div className="flex gap-2">
            <Input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onPasswordChange(e.target.value)
              }
              placeholder="Enter password..."
              className="bg-black border-green-500 text-green-400 font-mono focus:border-green-300"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && onSubmit()
              }
            />
            <Button
              onClick={onSubmit}
              className="bg-green-700 hover:bg-green-600 text-black font-bold pixel-art"
            >
              EXTRACT
            </Button>
          </div>

          <Button
            onClick={onCancel}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-900/20"
          >
            CANCEL
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
