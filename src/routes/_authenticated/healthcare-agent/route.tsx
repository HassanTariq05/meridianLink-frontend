import { createFileRoute } from '@tanstack/react-router'
import { HealthcareAgentView } from '@/features/healthcare-agent'

export const Route = createFileRoute('/_authenticated/healthcare-agent')({
  component: HealthcareAgentView,
})
