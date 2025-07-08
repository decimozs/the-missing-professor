import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/room3')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/rooms/room3"!</div>
}
