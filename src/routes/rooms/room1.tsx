import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rooms/room1")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/rooms/room1"!</div>;
}
