import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/rooms/room3')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-purple-400 font-mono flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Room 3: AI Chatbot Interaction</h1>
        <p className="text-xl">Coming Soon...</p>
        <p className="text-sm mt-4 text-purple-300">
          This room will feature an AI chatbot challenge where you'll need to extract information through conversation.
        </p>
      </div>
    </div>
  );
}
