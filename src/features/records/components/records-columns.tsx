import { type ColumnDef } from '@tanstack/react-table'
import { type LoanFollowupEmail } from '@/services/record-services/record-services'
import { Mail, User, Send, Ban, Clock, Phone } from 'lucide-react'
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

// Deterministic gradient per customer
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

export const recordsColumns: ColumnDef<LoanFollowupEmail>[] = [
  {
    accessorKey: 'lead_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lead ID' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground font-mono text-xs font-medium'>
        #{row.original.lead_id}
      </span>
    ),
  },

  {
    accessorKey: 'first_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer' />
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name
      const lastName = row.original.last_name
      const customerName = [firstName, lastName].filter(Boolean).join(' ')
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
            <div className='truncate text-sm font-medium'>
              {customerName || '—'}
            </div>

            <div className='text-muted-foreground flex items-center gap-1 truncate text-xs'>
              <Mail size={11} />
              {email || '—'}
            </div>
          </div>
        </div>
      )
    },
  },

  {
    accessorKey: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company' />
    ),
    cell: ({ row }) => {
      const company = row.original.company

      return (
        <div className='flex items-center gap-1.5 text-sm font-medium'>
          <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500' />
          <span className='truncate'>{company || '—'}</span>
        </div>
      )
    },
  },

  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone

      return (
        <div className='flex items-center gap-2 text-sm font-medium tabular-nums'>
          <Phone size={14} className='text-muted-foreground shrink-0' />
          <span>{phone || '—'}</span>
        </div>
      )
    },
  },

  {
    accessorKey: 'lead_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.lead_status

      const statusConfig = {
        approved: {
          label: 'Approved',
          icon: Send,
          className:
            'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400',
        },
        rejected: {
          label: 'Rejected',
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

      const normalizedStatus = status?.toLowerCase()

      const config = statusConfig[
        normalizedStatus as keyof typeof statusConfig
      ] ?? {
        label: status || '—',
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
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
]
