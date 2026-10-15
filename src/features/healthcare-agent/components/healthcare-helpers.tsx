import { format, parseISO } from 'date-fns'
import type { Patient } from '@/services/healthcare-agent-services/healthcare-agent-services'
import { Building2, Eye, Phone, Pill } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const AVATAR_TONES = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-cyan-500',
  'from-teal-500 to-emerald-500',
  'from-amber-500 to-orange-500',
]

export function formatStatus(status: string): string {
  return status.replace(/[_-]/g, ' ')
}

export function getStatusStyle(status: string): string {
  const normalized = formatStatus(status).toLowerCase()
  if (
    /complete|confirmed|booked|approved|success|processed|sent|fulfilled/.test(
      normalized
    )
  )
    return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
  if (
    /pending|waiting|in progress|processing|review|scheduled/.test(normalized)
  )
    return 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400'
  if (/failed|error|rejected|cancelled|canceled|missed/.test(normalized))
    return 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400'
  return 'border-border bg-muted/60 text-muted-foreground'
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant='outline'
      className={cn(
        'gap-1.5 px-2 py-0.5 font-medium capitalize',
        getStatusStyle(status)
      )}
    >
      <span className='h-1.5 w-1.5 rounded-full bg-current' />
      {formatStatus(status)}
    </Badge>
  )
}

export function getPatientName(patient: Patient | null): string {
  return patient
    ? `${patient.first_name} ${patient.last_name}`
    : 'Patient name unavailable'
}

export function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  const initials = (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')
  return initials.toUpperCase() || '?'
}

export function avatarTone(name: string): string {
  return AVATAR_TONES[name.length % AVATAR_TONES.length]
}

export function formatDateTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : format(date, 'MMM d, yyyy · h:mm a')
}

export function formatDateOnly(value?: string | null): string {
  if (!value) return '—'
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? value : format(date, 'EEE, MMM d, yyyy')
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return 'Just now'
  if (diff < 60 * 60_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 24 * 60 * 60_000) return `${Math.floor(diff / (60 * 60_000))}h ago`
  if (diff < 7 * 24 * 60 * 60_000)
    return `${Math.floor(diff / (24 * 60 * 60_000))}d ago`
  return format(date, 'MMM d, yyyy')
}

export function formatAppointmentSlot(date: string, startTime: string): string {
  const parsed = new Date(`${date}T${startTime}`)
  return Number.isNaN(parsed.getTime())
    ? `${date} ${startTime}`
    : format(parsed, 'EEE, MMM d · h:mm a')
}

export function PatientCell({
  name,
  phone,
}: {
  name: string
  phone?: string | null
}) {
  return (
    <div className='flex items-center gap-2.5'>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm',
          avatarTone(name)
        )}
      >
        {getInitials(name)}
      </div>
      <div className='min-w-0'>
        <p className='truncate font-medium'>{name}</p>
        {phone && (
          <p className='text-muted-foreground flex items-center gap-1 text-xs'>
            <Phone className='h-3 w-3' />
            {phone}
          </p>
        )}
      </div>
    </div>
  )
}

export function MedicationChip({
  name,
  strength,
}: {
  name: string
  strength: string
}) {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-md bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-500/20 dark:text-violet-300'>
      <Pill className='h-3 w-3' />
      {name}
      {strength && <span className='opacity-70'>· {strength}</span>}
    </span>
  )
}

export function PharmacyLabel({ name }: { name: string }) {
  return (
    <span className='inline-flex items-center gap-1.5 text-sm'>
      <Building2 className='text-muted-foreground h-3.5 w-3.5' />
      {name}
    </span>
  )
}

export function QuantityBadge({ value }: { value: number }) {
  return (
    <span className='bg-muted/40 inline-flex min-w-9 justify-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums'>
      {value}
    </span>
  )
}

export function RecordIdCode({ value }: { value: string }) {
  return (
    <code className='bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[11px]'>
      {value}
    </code>
  )
}

export function TimeCell({ value }: { value: string }) {
  return (
    <div className='leading-tight'>
      <p className='text-sm'>{formatDateTime(value)}</p>
      <p className='text-muted-foreground mt-0.5 text-xs'>
        {formatRelativeTime(value)}
      </p>
    </div>
  )
}

export function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      className='text-muted-foreground hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-full'
      onClick={onClick}
      aria-label='View record'
    >
      <Eye className='h-4 w-4' />
    </Button>
  )
}
