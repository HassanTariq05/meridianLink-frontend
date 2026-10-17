import {
  Clock3,
  Eye,
  Hash,
  Mic,
  Phone,
  PhoneIncoming,
  UserRound,
  Wallet,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  formatCurrency,
  formatDate,
  formatLoanType,
  getLoanTypeMeta,
  LoanApplication,
  STATUS_META,
} from './loan-application-columns'

type Tone = 'violet' | 'emerald' | 'sky' | 'amber'

const TONE: Record<Tone, { chip: string; card: string }> = {
  violet: {
    chip: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    card: 'border-l-violet-500',
  },
  emerald: {
    chip: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    card: 'border-l-emerald-500',
  },
  sky: {
    chip: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    card: 'border-l-sky-500',
  },
  amber: {
    chip: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    card: 'border-l-amber-500',
  },
}

function Section({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string
  icon: typeof Wallet
  tone: Tone
  children: React.ReactNode
}) {
  return (
    <section
      className={`bg-card min-w-0 rounded-xl border border-l-4 p-3 shadow-sm ${TONE[tone].card}`}
    >
      <div className='mb-2 flex items-center gap-2'>
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md ${TONE[tone].chip}`}
        >
          <Icon className='h-3.5 w-3.5' />
        </div>
        <h3 className='text-sm font-semibold'>{title}</h3>
      </div>
      <div className='space-y-2.5'>{children}</div>
    </section>
  )
}

function DetailItem({
  label,
  value,
  mono = false,
  highlight = false,
}: {
  label: string
  value: string | number | null | undefined
  mono?: boolean
  highlight?: boolean
}) {
  const empty = value === null || value === undefined || value === ''
  return (
    <div className='min-w-0'>
      <p className='text-muted-foreground text-[10px] font-medium tracking-wide uppercase'>
        {label}
      </p>
      <p
        className={`text-sm font-medium break-words ${mono ? 'font-mono text-xs' : ''} ${
          highlight ? 'text-emerald-600 dark:text-emerald-400' : ''
        } ${empty ? 'text-muted-foreground' : ''}`}
      >
        {empty ? '—' : value}
      </p>
    </div>
  )
}

function ApplicationDetails({ application }: { application: LoanApplication }) {
  const status = (application.status || 'new').toLowerCase()
  const statusMeta = STATUS_META[status] ?? STATUS_META.new
  const loanMeta = getLoanTypeMeta(application.loan_type)
  const LoanIcon = loanMeta.icon
  const amount = Number(application.requested_amount) || 0

  return (
    <div className='space-y-3'>
      <div className='relative overflow-hidden rounded-xl border bg-gradient-to-br from-violet-500/15 via-sky-500/10 to-emerald-500/15 p-4'>
        <div className='pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-fuchsia-500/20 blur-2xl' />
        <div className='pointer-events-none absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-sky-500/20 blur-2xl' />
        <div className='relative grid grid-cols-1 items-center gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]'>
          <div className='min-w-0'>
            <p className='text-muted-foreground flex items-center gap-1.5 text-xs'>
              <Hash className='h-3 w-3' /> Application ID
            </p>
            <p className='mt-0.5 font-mono text-base font-bold break-all'>
              {application.application_id}
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              Submitted {formatDate(application.submitted_at)}
            </p>
          </div>

          <div className='bg-background/70 rounded-lg border p-2.5 backdrop-blur'>
            <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>
              Amount
            </p>
            <p className='bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-base font-bold text-transparent tabular-nums dark:from-emerald-400 dark:to-teal-300'>
              {formatCurrency(amount)}
            </p>
          </div>

          <div className='bg-background/70 rounded-lg border p-2.5 backdrop-blur'>
            <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>
              Loan type
            </p>
            <p className='flex items-center gap-1.5 text-sm font-semibold'>
              <LoanIcon
                className={`h-4 w-4 ${loanMeta.chip.split(' ').find((c) => c.startsWith('text-'))}`}
              />
              {formatLoanType(application.loan_type || 'Unknown')}
            </p>
          </div>

          <div className='flex items-center justify-between gap-2 md:flex-col md:items-start'>
            <div className='bg-background/70 rounded-lg border p-2.5 backdrop-blur'>
              <p className='text-muted-foreground text-[10px] tracking-wide uppercase'>
                Callback
              </p>
              <p className='flex items-center gap-1.5 text-sm font-semibold'>
                <Clock3 className='h-4 w-4 text-amber-500' />
                {application.callback_time || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <Section title='Customer' icon={UserRound} tone='violet'>
          <DetailItem label='Customer name' value={application.customer_name} />
          <DetailItem
            label='Callback number'
            value={application.callback_number}
          />
          <DetailItem label='Caller number' value={application.caller_number} />
        </Section>

        <Section title='Loan details' icon={Wallet} tone='emerald'>
          <DetailItem
            label='Loan type'
            value={formatLoanType(application.loan_type || 'Unknown')}
          />
          <DetailItem
            label='Requested amount'
            value={formatCurrency(amount)}
            highlight
          />
          <DetailItem
            label='Amount as stated'
            value={application.amount_text}
          />
        </Section>

        <Section title='Call info' icon={Mic} tone='sky'>
          <DetailItem label='Call SID' value={application.call_sid} mono />
          <DetailItem label='Database ID' value={application.id} />
          <DetailItem
            label='Created'
            value={formatDate(application.createdAt)}
          />
          <DetailItem
            label='Updated'
            value={formatDate(application.updatedAt)}
          />
        </Section>

        <Section title='Next step' icon={PhoneIncoming} tone='amber'>
          <div className='flex items-center gap-2.5 rounded-lg bg-amber-500/10 p-2.5'>
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm'>
              <Phone className='h-3.5 w-3.5' />
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold'>Representative callback</p>
              <p className='text-muted-foreground text-xs break-words'>
                {application.callback_number || 'No number on file'} ·{' '}
                {application.callback_time || 'Any time'}
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}

export const ApplicationDialog = ({
  selected,
  setSelected,
}: {
  selected: LoanApplication | null
  setSelected: (application: LoanApplication | null) => void
}) => {
  return (
    <Dialog
      open={selected !== null}
      onOpenChange={(open) => {
        if (!open) setSelected(null)
      }}
    >
      <DialogContent className='w-[95vw] gap-3 p-5 sm:max-w-5xl'>
        <DialogHeader className='gap-1'>
          <DialogTitle className='flex items-center gap-2'>
            <span className='flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-sky-500 text-white'>
              <Eye className='h-3.5 w-3.5' />
            </span>
            Loan application details
          </DialogTitle>
          <DialogDescription>
            Review the information captured during the voice call.
          </DialogDescription>
        </DialogHeader>

        {selected && <ApplicationDetails application={selected} />}
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationDialog
