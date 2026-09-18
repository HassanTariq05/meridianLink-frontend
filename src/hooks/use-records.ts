import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useRecordService } from '@/services/record-services/record-services'
import { toast } from 'sonner'

export const recordQueryKeys = {
  all: () => ['loan-records'] as const,
}

export const useRecords = (date?: string) => {
  const recordService = useRecordService()

  return useQuery({
    queryKey: [...recordQueryKeys.all(), date],
    queryFn: () => recordService.getAll(date),
  })
}

export const useSyncRecords = () => {
  const { syncRecords } = useRecordService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: syncRecords,
    onSuccess: () => {
      toast.success('Records synced successfully!')
      queryClient.invalidateQueries({ queryKey: recordQueryKeys.all() })
    },
    onError: () => {
      toast.error('Failed to sync records.')
    },
  })
}

export const useApproveLoanFollowup = () => {
  const { approve } = useRecordService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: approve,
    onSuccess: () => {
      toast.success('Loan followup approved successfully!')
      queryClient.invalidateQueries({ queryKey: recordQueryKeys.all() })
    },
    onError: () => {
      toast.error('Failed to approve loan followup.')
    },
  })
}

export const useRejectLoanFollowup = () => {
  const { reject } = useRecordService()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reject,
    onSuccess: () => {
      toast.success('Loan followup rejected successfully!')
      queryClient.invalidateQueries({ queryKey: recordQueryKeys.all() })
    },
    onError: () => {
      toast.error('Failed to reject loan followup.')
    },
  })
}
