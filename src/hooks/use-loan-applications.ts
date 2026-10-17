import { useQuery } from '@tanstack/react-query'
import { useLoanApplicationService } from '@/services/loan-application-services/loan-application-services'

export const loanApplicationQueryKeys = {
  all: () => ['loan-applications'] as const,
}

export const useLoanApplications = () => {
  const { getLoanApplications } = useLoanApplicationService()

  return useQuery({
    queryKey: loanApplicationQueryKeys.all(),
    queryFn: getLoanApplications,
  })
}
