import { type ColumnDef } from '@tanstack/react-table'
import { type LoanFollowupEmail } from '@/services/record-services/record-services'
import { Mail, User, Send, Ban, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'

function formatDate(value?: string) {
  if (!value) return '—'

  const d = new Date(value)

  const datePart = d.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })

  const timePart = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return `${datePart} ${timePart}`
}

function formatCurrency(value?: number) {
  if (value == null) return '—'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

// Deterministic gradient per customer, so the same name always gets the same avatar color
const AVATAR_GRADIENTS = [
  'from-sky-400/90 to-blue-500/90',
  'from-violet-400/90 to-fuchsia-500/90',
  'from-emerald-400/90 to-teal-500/90',
  'from-amber-400/90 to-orange-500/90',
  'from-rose-400/90 to-pink-500/90',
] as const

function avatarGradient(name?: string) {
  if (!name) return AVATAR_GRADIENTS[0]
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length]
}

const LOAN_TYPE_DOT: Record<string, string> = {
  personal: 'bg-sky-500',
  auto: 'bg-violet-500',
  home: 'bg-emerald-500',
  business: 'bg-amber-500',
  mortgage: 'bg-emerald-500',
  student: 'bg-fuchsia-500',
}

export const recordsColumns: ColumnDef<LoanFollowupEmail>[] = [
  {
    accessorKey: 'leadId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lead ID' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground font-mono text-xs font-medium'>
        #{row.getValue('leadId')}
      </span>
    ),
  },

  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const customerName = row.getValue('customerName') as string
      const email = row.original.email

      return (
        <div className='flex items-center gap-2'>
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient(
              customerName
            )} text-white shadow-sm`}
          >
            <User size={14} />
          </div>

          <div className='min-w-0'>
            <div className='truncate text-sm font-medium'>{customerName}</div>

            <div className='text-muted-foreground flex items-center gap-1 truncate text-xs'>
              <Mail size={11} />
              {email}
            </div>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'loanType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Loan Type' />
    ),
    cell: ({ row }) => {
      const loanType = row.getValue('loanType') as string
      const dot =
        LOAN_TYPE_DOT[loanType?.toLowerCase()] ?? 'bg-muted-foreground'

      return (
        <div className='flex items-center gap-1.5 text-sm font-medium'>
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          {loanType}
        </div>
      )
    },
  },

  {
    accessorKey: 'loanAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Loan Amount' />
    ),
    cell: ({ row }) => (
      <div className='flex justify-end text-right text-sm font-semibold tabular-nums'>
        {formatCurrency(row.getValue('loanAmount'))}
      </div>
    ),
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      const statusConfig = {
        approved: {
          label: 'Email Sent',
          icon: Send,
          className:
            'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400',
        },
        rejected: {
          label: 'Discarded',
          icon: Ban,
          className:
            'bg-red-500/10 text-red-600 ring-1 ring-red-500/20 dark:text-red-400',
        },
        pending: {
          label: 'Pending',
          icon: Clock,
          className:
            'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400',
          pulse: true,
        },
      } as const

      const config = statusConfig[
        status.toLowerCase() as keyof typeof statusConfig
      ] ?? {
        label: status,
        icon: null,
        className: 'bg-muted text-muted-foreground',
        pulse: false,
      }

      const Icon = config.icon

      return (
        <Badge
          variant='outline'
          className={`inline-flex items-center gap-1.5 rounded-full border-none px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
          {'pulse' in config && config.pulse ? (
            <span className='relative flex h-2 w-2'>
              <span className='absolute h-full w-full animate-ping rounded-full bg-amber-400 opacity-75' />
              <span className='relative h-2 w-2 rounded-full bg-amber-500' />
            </span>
          ) : (
            Icon && <Icon size={12} />
          )}
          {config.label}
        </Badge>
      )
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-sm whitespace-nowrap'>
        {formatDate(row.getValue('createdAt'))}
      </span>
    ),
  },
]
