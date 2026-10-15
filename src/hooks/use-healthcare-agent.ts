import { useQuery } from '@tanstack/react-query'
import { useHealthcareAgentService } from '@/services/healthcare-agent-services/healthcare-agent-services'

export const healthcareQueryKeys = {
  all: () => ['healthcare-agent'] as const,
  metrics: () => [...healthcareQueryKeys.all(), 'metrics'] as const,
  appointments: () => [...healthcareQueryKeys.all(), 'appointments'] as const,
  refills: () => [...healthcareQueryKeys.all(), 'refills'] as const,
}

export const useMetrics = () => {
  const { getMetrics } = useHealthcareAgentService()

  return useQuery({
    queryKey: healthcareQueryKeys.metrics(),
    queryFn: getMetrics,
  })
}

export const useAppointments = () => {
  const { getAppointments } = useHealthcareAgentService()

  return useQuery({
    queryKey: healthcareQueryKeys.appointments(),
    queryFn: getAppointments,
  })
}

export const useRefills = () => {
  const { getRefills } = useHealthcareAgentService()

  return useQuery({
    queryKey: healthcareQueryKeys.refills(),
    queryFn: getRefills,
  })
}
