import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ZipUnlockedContentProps {
  encryptedMessage: string;
}

export function ZipUnlockedContent({
  encryptedMessage,
}: ZipUnlockedContentProps) {
  return (
    <Card className="bg-gray-800 border-green-500 border-2 neon-glow animate-fade-in">
      <CardHeader className="border-b border-green-500/50">
        <CardTitle className="text-green-400 font-mono text-lg">
          ✅ ZIP Extracted Successfully
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <p className="text-green-300">Contents of research_data.zip:</p>

          <div className="bg-black/60 border border-green-500 p-4 font-mono text-sm">
            <div className="text-green-400 mb-2">📄 secret_message.txt</div>
            <div className="text-green-300 bg-green-900/20 p-3 border-l-4 border-green-500">
              <p className="text-yellow-400 mb-2">ENCRYPTED MESSAGE:</p>
              <p className="break-all">{encryptedMessage}</p>
              <p className="text-gray-400 text-xs mt-2">
                * This message appears to be encrypted. You'll need to decode it
                for the next room.
              </p>
            </div>
          </div>

          <div className="text-green-400 text-sm">
            🎉 Room 1 Complete! Use this encrypted message in Room 2.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
