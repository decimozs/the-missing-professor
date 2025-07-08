import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rooms/room4")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/rooms/room4"!</div>;
}
