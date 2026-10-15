import { createFileRoute } from '@tanstack/react-router'
import ChatAgent from '@/features/chat-agent'

export const Route = createFileRoute('/_authenticated/chat-agent')({
  component: ChatAgent,
})
