import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginActivityLogProps {
  onClose: () => void;
}

export function LoginActivityLog({ onClose }: LoginActivityLogProps) {
  return (
    <Card className="bg-gray-800 border-green-500 border-2 neon-glow animate-fade-in">
      <CardHeader className="border-b border-green-500/50">
        <CardTitle className="text-green-400 font-mono text-lg">
          📊 Computer Access Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-black/80 border border-green-500 p-4 font-mono text-sm">
          <div className="text-green-400 font-bold mb-4">
            LOGIN LOG – TERMINAL 01
          </div>
          <div className="space-y-2">
            <div className="text-green-300">User: eladio.ramirez</div>
            <div className="border-l-4 border-green-500 pl-4 space-y-1">
              <div>
                Mar 17, 2025 – 13:42 –{" "}
                <span className="text-green-400">LOGIN SUCCESS</span>
              </div>
              <div>
                Mar 18, 2025 – 08:12 –{" "}
                <span className="text-red-400">LOGIN FAILED</span>
              </div>
              <div>
                Mar 18, 2025 – 08:14 –{" "}
                <span className="text-red-400">LOGIN FAILED</span>
              </div>
              <div>
                Mar 18, 2025 – 08:16 –{" "}
                <span className="text-green-400">LOGIN SUCCESS</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-gray-400 text-xs">
            💡 Notice: Multiple failed login attempts detected before successful
            login
          </div>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="mt-4 border-green-500 text-green-400 hover:bg-green-900/20"
        >
          CLOSE LOG
        </Button>
      </CardContent>
    </Card>
  );
}
