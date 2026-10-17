import { createFileRoute } from '@tanstack/react-router'
import { LoanApplicationsView } from '@/features/loan-applications'

export const Route = createFileRoute('/_authenticated/loan-application-agent')({
  component: LoanApplicationsView,
})
