import type { ReactNode } from 'react'
import type {
  Appointment,
  RefillRecord,
} from '@/services/healthcare-agent-services/healthcare-agent-services'
import type { LucideIcon } from 'lucide-react'
import {
  CalendarDays,
  Clock3,
  MessageSquareText,
  Pill,
  Stethoscope,
  UserRound,
  Building2,
  Hash,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  StatusBadge,
  avatarTone,
  formatDateOnly,
  formatDateTime,
  formatRelativeTime,
  getInitials,
  getPatientName,
} from './loan-application-helpers'

export type SelectedRecord =
  | { kind: 'refill'; record: RefillRecord }
  | { kind: 'appointment'; record: Appointment }

type RecordDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selected: SelectedRecord | null
}

type Tone = 'violet' | 'teal' | 'sky' | 'amber'

const TONES: Record<
  Tone,
  { hero: string; chip: string; soft: string; bar: string }
> = {
  violet: {
    hero: 'from-violet-500/15 via-background to-fuchsia-500/10',
    chip: 'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
    soft: 'border-violet-500/20 bg-violet-500/5',
    bar: 'from-violet-500 to-fuchsia-500',
  },
  teal: {
    hero: 'from-teal-500/15 via-background to-emerald-500/10',
    chip: 'bg-teal-500/10 text-teal-600 ring-teal-500/20 dark:text-teal-400',
    soft: 'border-teal-500/20 bg-teal-500/5',
    bar: 'from-teal-500 to-emerald-500',
  },
  sky: {
    hero: 'from-sky-500/15 via-background to-cyan-500/10',
    chip: 'bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400',
    soft: 'border-sky-500/20 bg-sky-500/5',
    bar: 'from-sky-500 to-cyan-500',
  },
  amber: {
    hero: 'from-amber-500/15 via-background to-orange-500/10',
    chip: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
    soft: 'border-amber-500/20 bg-amber-500/5',
    bar: 'from-amber-500 to-orange-500',
  },
}

function Field({
  label,
  value,
  mono,
  wide,
}: {
  label: string
  value?: string | number | null
  mono?: boolean
  wide?: boolean
}) {
  return (
    <div className={cn('min-w-0', wide && 'col-span-2')}>
      <dt className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
        {label}
      </dt>
      <dd
        className={cn(
          'mt-0.5 text-sm font-medium break-words',
          mono && 'font-mono text-xs'
        )}
      >
        {value || '—'}
      </dd>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  tone,
  children,
  className,
}: {
  title: string
  icon: LucideIcon
  tone: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'bg-card relative overflow-hidden rounded-xl border p-4 shadow-sm',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r',
          TONES[tone].bar
        )}
      />
      <header className='mb-4 flex items-center gap-2.5'>
        <span
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg ring-1',
            TONES[tone].chip
          )}
        >
          <Icon className='h-4 w-4' />
        </span>
        <h3 className='text-sm font-semibold'>{title}</h3>
      </header>
      <dl className='grid grid-cols-2 gap-x-4 gap-y-3.5'>{children}</dl>
    </section>
  )
}

function QuickStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon
  label: string
  value?: string | null
  tone: Tone
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-3 rounded-xl border p-3 backdrop-blur-sm',
        TONES[tone].soft
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1',
          TONES[tone].chip
        )}
      >
        <Icon className='h-4 w-4' />
      </span>
      <div className='min-w-0'>
        <p className='text-muted-foreground text-[11px] font-medium tracking-wide uppercase'>
          {label}
        </p>
        <p className='truncate text-sm font-semibold'>{value || '—'}</p>
      </div>
    </div>
  )
}

function DialogShell({
  tone,
  name,
  id,
  status,
  submittedAt,
  quickStats,
  children,
}: {
  tone: Tone
  name: string
  id: string
  status: string
  submittedAt: string
  quickStats: { icon: LucideIcon; label: string; value?: string | null }[]
  children: ReactNode
}) {
  return (
    <DialogContent className='w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0 sm:max-w-6xl'>
      <div className={cn('bg-gradient-to-br', TONES[tone].hero)}>
        <div className={cn('h-1 w-full bg-gradient-to-r', TONES[tone].bar)} />
        <DialogHeader className='flex-row items-center gap-4 p-6 text-left'>
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-semibold text-white shadow-md',
              avatarTone(name)
            )}
          >
            {getInitials(name)}
          </div>
          <div className='min-w-0 flex-1'>
            <DialogTitle className='truncate text-xl'>{name}</DialogTitle>
            <DialogDescription asChild>
              <div className='mt-1.5 flex flex-wrap items-center gap-2 text-xs'>
                <code className='bg-background/70 rounded-md border px-1.5 py-0.5 font-mono text-[11px]'>
                  {id}
                </code>
                <StatusBadge status={status} />
                <span className='text-muted-foreground flex items-center gap-1'>
                  <Clock3 className='h-3.5 w-3.5' />
                  {formatDateTime(submittedAt)} ·{' '}
                  {formatRelativeTime(submittedAt)}
                </span>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className='grid gap-3 px-6 pb-6 sm:grid-cols-3'>
          {quickStats.map((stat) => (
            <QuickStat key={stat.label} {...stat} tone={tone} />
          ))}
        </div>
      </div>

      <div className='max-h-[60vh] overflow-y-auto p-6'>
        <div className='grid gap-4 md:grid-cols-3'>{children}</div>
      </div>
    </DialogContent>
  )
}

function RefillDetails({ record }: { record: RefillRecord }) {
  const patientName = getPatientName(record.patient)
  return (
    <DialogShell
      tone='violet'
      name={patientName}
      id={record.request_id}
      status={record.status}
      submittedAt={record.created_at}
      quickStats={[
        {
          icon: Pill,
          label: 'Medication',
          value: `${record.medication_name} ${record.strength}`.trim(),
        },
        {
          icon: Hash,
          label: 'Quantity',
          value: `${record.requested_quantity} requested`,
        },
        { icon: Building2, label: 'Pharmacy', value: record.pharmacy_name },
      ]}
    >
      <Section title='Prescription' icon={Pill} tone='violet'>
        <Field label='Medication' value={record.medication_name} />
        <Field label='Strength' value={record.strength} />
        <Field
          label='Quantity requested'
          value={String(record.requested_quantity)}
        />
        <Field label='Pharmacy' value={record.pharmacy_name} />
        <Field
          label='Prescription ID'
          value={record.prescription_id}
          mono
          wide
        />
      </Section>

      <Section title='Patient' icon={UserRound} tone='sky'>
        <Field label='Phone' value={record.patient?.phone} />
        <Field
          label='Date of birth'
          value={formatDateOnly(record.patient?.date_of_birth)}
        />
        <Field label='Patient ID' value={record.patient_id} mono wide />
      </Section>

      <Section title='Request' icon={Clock3} tone='amber'>
        <Field
          label='Submitted'
          value={formatDateTime(record.created_at)}
          wide
        />
        <Field
          label='Caller confirmed'
          value={record.caller_confirmation ? 'Yes' : 'No'}
        />
        <Field label='Record ID' value={String(record.id)} />
        <Field label='Call SID' value={record.call_sid} mono wide />
      </Section>
    </DialogShell>
  )
}

function AppointmentDetails({ record }: { record: Appointment }) {
  const patientName = getPatientName(record.patient)
  return (
    <DialogShell
      tone='teal'
      name={patientName}
      id={record.appointment_id}
      status={record.status}
      submittedAt={record.created_at}
      quickStats={[
        {
          icon: CalendarDays,
          label: 'Date',
          value: formatDateOnly(record.appointment_date),
        },
        {
          icon: Clock3,
          label: 'Time',
          value: `${record.start_time} – ${record.end_time}`,
        },
        {
          icon: Stethoscope,
          label: 'Doctor',
          value: record.doctor?.doctor_name,
        },
      ]}
    >
      <Section title='Appointment' icon={CalendarDays} tone='teal'>
        <Field label='Date' value={formatDateOnly(record.appointment_date)} />
        <Field
          label='Time'
          value={`${record.start_time} – ${record.end_time}`}
        />
        <Field label='Slot ID' value={record.slot_id} mono wide />
        <Field
          label='Submitted'
          value={formatDateTime(record.created_at)}
          wide
        />
      </Section>

      <Section title='Provider' icon={Stethoscope} tone='sky'>
        <Field label='Doctor' value={record.doctor?.doctor_name} wide />
        <Field label='Specialty' value={record.doctor?.specialty} />
        <Field
          label='Consultation fee'
          value={
            record.doctor ? `$${record.doctor.consultation_fee}` : undefined
          }
        />
        <Field label='Phone' value={record.doctor?.phone} wide />
      </Section>

      <Section title='Patient' icon={UserRound} tone='violet'>
        <Field label='Phone' value={record.patient?.phone} />
        <Field
          label='Date of birth'
          value={formatDateOnly(record.patient?.date_of_birth)}
        />
        <Field label='Patient ID' value={record.patient_id} mono wide />
        <Field label='Call SID' value={record.call_sid} mono wide />
      </Section>

      {record.reason_for_visit && (
        <section className='bg-card relative overflow-hidden rounded-xl border p-4 shadow-sm md:col-span-3'>
          <div className='absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500' />
          <header className='mb-2 flex items-center gap-2.5'>
            <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 ring-1 ring-teal-500/20 dark:text-teal-400'>
              <MessageSquareText className='h-4 w-4' />
            </span>
            <h3 className='text-sm font-semibold'>Reason for visit</h3>
          </header>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {record.reason_for_visit}
          </p>
        </section>
      )}
    </DialogShell>
  )
}

export function RecordDetailDialog({
  open,
  onOpenChange,
  selected,
}: RecordDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {selected?.kind === 'refill' && (
        <RefillDetails record={selected.record} />
      )}
      {selected?.kind === 'appointment' && (
        <AppointmentDetails record={selected.record} />
      )}
    </Dialog>
  )
}
