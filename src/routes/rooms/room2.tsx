import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rooms/room2")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/rooms/room2"!</div>;
}
