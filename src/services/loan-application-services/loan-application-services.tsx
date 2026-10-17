import { useApiClient } from '@/lib/axios'

export interface LoanApplication {
  id: number
  application_id: string
  call_sid: string
  customer_name: string
  loan_type: 'home' | 'business' | 'auto' | 'personal' | string
  requested_amount: number
  amount_text: string | null
  callback_number: string
  caller_number: string
  callback_time: string
  status: 'new' | 'pending' | 'approved' | 'rejected' | string
  submitted_at: string
  createdAt: string
  updatedAt: string
}

export interface LoanApplicationsResponse {
  success: boolean
  count: number
  applications: LoanApplication[]
}

export const useLoanApplicationService = () => {
  const apiClient = useApiClient()

  const getLoanApplications = async (): Promise<LoanApplicationsResponse> => {
    const { data } = await apiClient.get<LoanApplicationsResponse>(
      '/webhook/loan-applications',
      { withCredentials: false }
    )

    return data
  }

  return { getLoanApplications }
}
