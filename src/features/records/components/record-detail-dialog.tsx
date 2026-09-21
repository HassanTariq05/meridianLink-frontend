import {
  Ban,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Phone,
  Send,
  User,
} from 'lucide-react'
import {
  useApproveLoanFollowup,
  useRejectLoanFollowup,
} from '@/hooks/use-records'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useTasks } from './records-provider'

function formatDate(value?: string) {
  if (!value) return '—'

  const date = new Date(value)

  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function getStatusIcon(status?: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
      return Send
    case 'rejected':
      return Ban
    case 'pending':
      return Clock3
    default:
      return null
  }
}

function getStatusClass(status?: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400'
    case 'pending':
      return 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400'
    case 'rejected':
      return 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:text-red-400'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getStatusLabel(status?: string) {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'Email Sent'
    case 'rejected':
      return 'Discarded'
    case 'pending':
      return 'Pending'
    default:
      return status || '—'
  }
}

// One color per info row — matches the pipeline/columns palette used elsewhere
const FIELD_COLORS = {
  customer: 'bg-sky-500/10 text-sky-500',
  email: 'bg-violet-500/10 text-violet-500',
  loanType: 'bg-amber-500/10 text-amber-500',
  loanAmount: 'bg-emerald-500/10 text-emerald-500',
  created: 'bg-slate-500/10 text-slate-500',
  updated: 'bg-slate-500/10 text-slate-500',
  phone: 'bg-lime-500/10 text-lime-500',
} as const

function FieldRow({
  icon: Icon,
  color,
  label,
  children,
}: {
  icon: React.ElementType
  color: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='flex items-start gap-3'>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${color}`}
      >
        <Icon className='size-4' />
      </div>
      <div className='min-w-0'>
        <p className='text-muted-foreground text-xs'>{label}</p>
        <div className='mt-1 text-sm font-medium'>{children}</div>
      </div>
    </div>
  )
}

export function RecordDetailDialog() {
  const { open, setOpen, currentRow } = useTasks()

  const isOpen = open === 'view'
  const isPending = currentRow?.lead_status?.toLowerCase() === 'pending'

  if (!currentRow) {
    return null
  }

  const handleClose = () => {
    setOpen(null)
  }

  const approveLoanFollowupMutation = useApproveLoanFollowup()
  const rejectLoanFollowupMutation = useRejectLoanFollowup()

  const handleApprove = () => {
    approveLoanFollowupMutation.mutate({
      id: currentRow.id,
      status: 'approved',
    })
  }

  const handleReject = () => {
    rejectLoanFollowupMutation.mutate({
      id: currentRow.id,
      status: 'rejected',
    })
  }

  const StatusIcon = getStatusIcon(currentRow.lead_status)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (!value) {
          setOpen(null)
        }
      }}
    >
      <DialogContent className='flex h-[95vh] max-w-none min-w-[90vw] flex-col gap-0 overflow-hidden p-0'>
        {/* Header */}
        <DialogHeader className='relative shrink-0 overflow-hidden border-b px-6 py-4'>
          <div className='pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/15 to-fuchsia-500/5 blur-3xl' />

          <DialogTitle className='relative flex items-center gap-2.5'>
            <div className='flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm'>
              <Mail size={16} className='text-white' />
            </div>
            Loan Follow-up
          </DialogTitle>

          <DialogDescription className='relative'>
            Lead #{currentRow.lead_id} · Record #{currentRow.id}
          </DialogDescription>
        </DialogHeader>

        {/* Main Content */}
        <div className='grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)]'>
          {/* Left: Record Information */}
          <div className='overflow-y-auto border-b p-6 lg:border-r lg:border-b-0'>
            <div className='mb-5'>
              <h3 className='text-sm font-semibold'>Record Information</h3>
              <p className='text-muted-foreground mt-1 text-xs'>
                Loan application details
              </p>
            </div>

            <div className='space-y-5'>
              <FieldRow
                icon={User}
                color={FIELD_COLORS.customer}
                label='Customer'
              >
                {`${currentRow.first_name} ${currentRow.last_name}`}
              </FieldRow>

              <FieldRow icon={Mail} color={FIELD_COLORS.email} label='Email'>
                <span className='break-all'>{currentRow.email}</span>
              </FieldRow>

              <FieldRow icon={Phone} color={FIELD_COLORS.phone} label='Phone'>
                <span className='break-all'>{currentRow.phone}</span>
              </FieldRow>

              {/* Status */}
              <div className='flex items-start gap-3'>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${getStatusClass(currentRow.lead_status)}`}
                >
                  <CheckCircle2 className='size-4' />
                </div>

                <div>
                  <p className='text-muted-foreground text-xs'>Status</p>

                  <Badge
                    variant='outline'
                    className={`mt-1 rounded-full border-none capitalize ${getStatusClass(
                      currentRow.lead_status
                    )}`}
                  >
                    {isPending ? (
                      <span className='relative flex h-2 w-2'>
                        <span className='absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75' />
                        <span className='relative h-2 w-2 rounded-full bg-amber-500' />
                      </span>
                    ) : (
                      StatusIcon && <StatusIcon className='size-3.5' />
                    )}
                    {getStatusLabel(currentRow.lead_status)}
                  </Badge>
                </div>
              </div>

              <FieldRow
                icon={Clock3}
                color={FIELD_COLORS.created}
                label='Created'
              >
                {formatDate(currentRow.createdAt)}
              </FieldRow>

              <FieldRow
                icon={CalendarDays}
                color={FIELD_COLORS.updated}
                label='Last Updated'
              >
                {formatDate(currentRow.updatedAt)}
              </FieldRow>
            </div>
          </div>

          {/* Right: Email */}
          <div className='min-h-0 overflow-y-auto p-6'>
            <div className='mb-5'>
              <h3 className='text-sm font-semibold'>Generated Email</h3>
              <p className='text-muted-foreground mt-1 text-xs'>
                Preview of the follow-up email
              </p>
            </div>

            <div className='overflow-hidden rounded-lg border'>
              {/* Email Header */}
              <div className='space-y-4 bg-gradient-to-br from-violet-500/[0.06] to-fuchsia-500/[0.02] p-5'>
                <div className='flex gap-4'>
                  <span className='text-muted-foreground w-16 shrink-0 text-xs font-medium'>
                    To
                  </span>

                  <span className='min-w-0 text-sm break-all'>
                    {`${currentRow.first_name} ${currentRow.last_name}`}{' '}
                    <span className='text-muted-foreground'>
                      &lt;{currentRow.email}&gt;
                    </span>
                  </span>
                </div>

                <div className='flex gap-4'>
                  <span className='text-muted-foreground w-16 shrink-0 text-xs font-medium'>
                    Subject
                  </span>

                  <span className='min-w-0 text-sm font-medium'>
                    {currentRow.subject}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Email Body */}
              <div className='p-6'>
                <div className='max-w-3xl text-sm leading-7 break-words whitespace-pre-wrap'>
                  {currentRow.body}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <DialogFooter className='bg-background shrink-0 border-t px-6 py-4'>
          {isPending ? (
            <>
              <Button
                type='button'
                disabled={rejectLoanFollowupMutation.isPending}
                variant='destructive'
                onClick={() => {
                  handleReject()
                  handleClose()
                }}
              >
                {rejectLoanFollowupMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Discarding...
                  </>
                ) : (
                  <>
                    <Ban size={16} />
                    Discard
                  </>
                )}
              </Button>

              <Button
                disabled={approveLoanFollowupMutation.isPending}
                type='button'
                className='bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600'
                onClick={async () => {
                  handleApprove()
                  handleClose()
                }}
              >
                {approveLoanFollowupMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Email
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button type='button' variant='outline' onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
