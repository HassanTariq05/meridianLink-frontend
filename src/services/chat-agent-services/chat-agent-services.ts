import { useApiClient } from '@/lib/axios'

export const useChatAgentService = () => {
  const apiClient = useApiClient()

  const ask = async (payload: {
    chatInput: string
    sessionId: string
  }): Promise<any> => {
    const { data } = await apiClient.post(
      '/webhook/sql-database-agent',
      payload,
      {
        withCredentials: false,
      }
    )

    return data
  }

  return { ask }
}
