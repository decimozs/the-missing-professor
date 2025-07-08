import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useGameStore } from "../stores/gameStore";

export const Route = createRootRoute({
  component: IndexRoute,
});

function IndexRoute() {
  const location = useLocation();
  const { gameStarted } = useGameStore();

  // Hide navigation when in game mode (rooms) or when game has started
  const hideNavigation = gameStarted || location.pathname.startsWith("/rooms");

  return (
    <div className="min-h-screen bg-zinc-900 text-white font-sans tracking-widest">
      {!hideNavigation && (
        <nav className="bg-black/50 border-b border-emerald-500/30 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-mono text-sm uppercase">
                The Missing Professor
              </span>
            </div>
            <div className="flex gap-6 font-mono text-sm">
              <Link
                to="/"
                className="text-zinc-300 hover:text-emerald-400 transition-colors [&.active]:text-emerald-400"
              >
                [HOME]
              </Link>
              <Link
                to="/about"
                className="text-zinc-300 hover:text-emerald-400 transition-colors [&.active]:text-emerald-400"
              >
                [ABOUT]
              </Link>
            </div>
          </div>
        </nav>
      )}
      <Outlet />
    </div>
  );
}
