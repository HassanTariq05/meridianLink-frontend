import { useMutation } from '@tanstack/react-query'
import { useChatAgentService } from '@/services/chat-agent-services/chat-agent-services'
import { toast } from 'sonner'

export const useAskChatAgent = () => {
  const { ask } = useChatAgentService()

  return useMutation({
    mutationFn: ask,

    onError: () => {
      toast.error('Failed to ask chat agent.')
    },
  })
}
