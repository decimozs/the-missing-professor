import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/room5')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rooms/room5"!</div>
}
