import { createFileRoute } from '@tanstack/react-router'
import { RecordsView } from '@/features/records'

export const Route = createFileRoute('/_authenticated/loan-followup-agent')({
  component: RecordsView,
})
