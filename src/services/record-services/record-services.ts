import { useApiClient } from '@/lib/axios'

export interface ValidicMetric {
  type: string
  value: number
  unit?: string
}

export interface LoanFollowupEmail {
  id: number
  lead_id: string
  company: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  subject: string
  body: string
  createdAt: string
  updatedAt: string
  notes: string
}
interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const useRecordService = () => {
  const apiClient = useApiClient()

  const getAll = async (date?: string): Promise<LoanFollowupEmail[]> => {
    const { data } = await apiClient.get<PageResponse<LoanFollowupEmail>>(
      '/webhook/loan-followups/all',
      {
        params: {
          ...(date ? { date } : {}),
        },
        withCredentials: false,
      }
    )

    return data as any
  }

  const approve = async (payload: {
    id: number
    status: 'approved'
  }): Promise<any> => {
    const { data } = await apiClient.post('/webhook/loan-followups', payload, {
      withCredentials: false,
    })

    return data
  }

  const reject = async (payload: {
    id: number
    status: 'rejected'
  }): Promise<any> => {
    const { data } = await apiClient.post('/webhook/loan-followups', payload, {
      withCredentials: false,
    })

    return data
  }

  const syncRecords = async (): Promise<LoanFollowupEmail[]> => {
    const { data } = await apiClient.get<PageResponse<LoanFollowupEmail>>(
      '/webhook/loan-followups/sync',
      {
        withCredentials: false,
      }
    )

    return data.content
  }

  return { getAll, syncRecords, approve, reject }
}
