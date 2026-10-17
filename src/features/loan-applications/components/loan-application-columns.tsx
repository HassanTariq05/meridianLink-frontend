import type { ColumnDef } from '@tanstack/react-table'
import {
  Briefcase,
  Car,
  CalendarDays,
  Clock3,
  CircleHelp,
  Eye,
  GraduationCap,
  House,
  Phone,
  Wallet,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'

export type LoanApplication = {
  id: number
  application_id: string
  call_sid: string
  customer_name: string
  loan_type: string
  requested_amount: number
  amount_text?: string | null
  callback_number: string
  caller_number: string
  callback_time: string
  status: string
  submitted_at: string
  createdAt: string
  updatedAt: string
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatLoanType(value: string) {
  return value
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export const LOAN_TYPE_META: Record<
  string,
  { icon: typeof Wallet; chip: string; dot: string }
> = {
  personal: {
    icon: Wallet,
    chip: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  home: {
    icon: House,
    chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  auto: {
    icon: Car,
    chip: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  business: {
    icon: Briefcase,
    chip: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  education: {
    icon: GraduationCap,
    chip: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  other: {
    icon: CircleHelp,
    chip: 'border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-500',
  },
}

export const getLoanTypeMeta = (type?: string | null) =>
  LOAN_TYPE_META[(type || 'other').toLowerCase()] ?? LOAN_TYPE_META.other

export const STATUS_META: Record<string, { chip: string; dot: string }> = {
  new: {
    chip: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  pending: {
    chip: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  contacted: {
    chip: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
  },
  approved: {
    chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  completed: {
    chip: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  rejected: {
    chip: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
    dot: 'bg-red-500',
  },
}

const AVATAR_GRADIENTS = [
  'from-violet-500 to-fuchsia-500',
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-400',
]

const getAvatarGradient = (name: string) => {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length]
}

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'

export function getApplicationColumns(
  onView: (record: LoanApplication) => void
): ColumnDef<LoanApplication>[] {
  return [
    {
      accessorKey: 'application_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Application' />
      ),
      cell: ({ row }) => (
        <button
          type='button'
          onClick={() => onView(row.original)}
          className='bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs font-semibold transition-colors'
        >
          <span className='bg-primary h-1.5 w-1.5 rounded-full' />
          {row.original.application_id}
        </button>
      ),
    },
    {
      accessorKey: 'customer_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Customer' />
      ),
      cell: ({ row }) => {
        const name = row.original.customer_name || 'Unknown customer'
        return (
          <div className='flex min-w-0 items-center gap-3'>
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm ${getAvatarGradient(name)}`}
            >
              {getInitials(name)}
            </div>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold'>{name}</p>
              <p className='text-muted-foreground truncate text-xs'>
                {row.original.callback_number || 'No callback number'}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'loan_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Loan Type' />
      ),
      cell: ({ row }) => {
        const meta = getLoanTypeMeta(row.original.loan_type)
        const Icon = meta.icon
        return (
          <Badge
            variant='outline'
            className={`gap-1.5 font-medium ${meta.chip}`}
          >
            <Icon className='h-3.5 w-3.5' />
            {formatLoanType(row.original.loan_type || 'unknown')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'requested_amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Requested Amount' />
      ),
      cell: ({ row }) => {
        const amount = Number(row.original.requested_amount) || 0
        const stated = row.original.amount_text
        return (
          <div className='min-w-0'>
            <p className='flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-sm font-bold text-transparent tabular-nums dark:from-emerald-400 dark:to-teal-300'>
              <Wallet className='h-3.5 w-3.5 text-emerald-500' />
              {formatCurrency(amount)}
            </p>
            {stated && stated !== formatCurrency(amount) && (
              <p className='text-muted-foreground max-w-36 truncate text-xs'>
                Caller said: {stated}
              </p>
            )}
          </div>
        )
      },
    },
    {
      id: 'callback',
      accessorFn: (row) => row.callback_time ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Callback' />
      ),
      cell: ({ row }) => (
        <div className='flex min-w-0 items-start gap-2.5'>
          <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400'>
            <Clock3 className='h-3.5 w-3.5' />
          </div>
          <div className='min-w-0'>
            <p className='text-sm font-medium'>
              {row.original.callback_time || 'Not specified'}
            </p>
            <p className='text-muted-foreground flex items-center gap-1 text-xs'>
              <Phone className='h-3 w-3' />
              {row.original.callback_number || 'No number'}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = (row.original.status || 'new').toLowerCase()
        const meta = STATUS_META[status] ?? STATUS_META.new
        return (
          <Badge
            variant='outline'
            className={`gap-1.5 capitalize ${meta.chip}`}
          >
            <span
              className={`h-1.5 w-1.5 animate-pulse rounded-full ${meta.dot}`}
            />
            {status.replace(/[_-]/g, ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'submitted_at',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Submitted' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-2 whitespace-nowrap'>
          <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400'>
            <CalendarDays className='h-3.5 w-3.5' />
          </div>
          <span className='text-muted-foreground text-xs'>
            {formatDate(row.original.submitted_at)}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <span className='sr-only'>Actions</span>,
      cell: ({ row }) => (
        <div className='flex justify-end'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-primary hover:bg-primary/10 hover:text-primary h-8 w-8 rounded-full'
            aria-label={`View ${row.original.application_id}`}
            title='View application'
            onClick={() => onView(row.original)}
          >
            <Eye className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ]
}
