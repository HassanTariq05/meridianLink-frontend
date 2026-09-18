import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  Activity,
  ArrowRight,
  Bot,
  CalendarIcon,
  Clock3,
  Mail,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { useRecords } from '@/hooks/use-records'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { RecordDetailDialog } from './components/record-detail-dialog'
import { Records } from './components/records'
import { TasksProvider } from './components/records-provider'

const PIPELINE_STEPS = [
  {
    icon: Users,
    label: 'Leads',
    desc: 'Incoming data',
    ring: 'ring-sky-500/20',
    bg: 'bg-sky-500/10',
    icon_color: 'text-sky-500',
  },
  {
    icon: Sparkles,
    label: 'AI Generation',
    desc: 'Personalized emails',
    ring: 'ring-violet-500/30',
    bg: 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
    icon_color: 'text-white',
    glow: true,
  },
  {
    icon: Clock3,
    label: 'Human Review',
    desc: 'Approval required',
    ring: 'ring-amber-500/20',
    bg: 'bg-amber-500/10',
    icon_color: 'text-amber-500',
  },
  {
    icon: Mail,
    label: 'Delivery',
    desc: 'Approved emails',
    ring: 'ring-emerald-500/20',
    bg: 'bg-emerald-500/10',
    icon_color: 'text-emerald-500',
  },
] as const

const METRICS = [
  { key: 'total', label: 'Generated', from: 'from-sky-500', to: 'to-sky-600' },
  {
    key: 'pending',
    label: 'Awaiting Review',
    from: 'from-amber-500',
    to: 'to-amber-600',
  },
  {
    key: 'sent',
    label: 'Sent',
    from: 'from-emerald-500',
    to: 'to-emerald-600',
  },
  {
    key: 'discarded',
    label: 'Discarded',
    from: 'from-rose-500',
    to: 'to-rose-600',
  },
] as const

export function RecordsView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const apiDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined

  const { data: records, isLoading: isFetchingRecords } = useRecords(apiDate)

  const agentStats = useMemo(() => {
    if (!records?.length) {
      return { total: 0, pending: 0, sent: 0, discarded: 0, latestRecord: null }
    }

    const pending = records?.filter(
      (r) => r.status?.toLowerCase() === 'pending'
    ).length
    const sent = records?.filter(
      (r) => r.status?.toLowerCase() === 'approved'
    ).length
    const discarded = records?.filter(
      (r) => r.status?.toLowerCase() === 'rejected'
    ).length
    const latestRecord = [...records]?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]

    return { total: records.length, pending, sent, discarded, latestRecord }
  }, [records])

  const formatAgentDate = (date?: string) => {
    if (!date) return '—'
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const formatRelativeTime = (date?: string) => {
    if (!date) return '—'
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return formatAgentDate(date)
  }

  return (
    <TasksProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 py-0 pb-6 sm:gap-6'>
        {isFetchingRecords ? (
          <InfoSkeleton />
        ) : (
          <div className='pt-2'>
            <div className='bg-card relative overflow-hidden rounded-xl border'>
              <div className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent blur-3xl' />
              <div className='pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-500/10 to-transparent blur-3xl' />

              <div className='relative flex flex-col gap-6 p-5 md:p-6'>
                <div className='flex flex-col justify-between gap-5 md:flex-row md:items-start'>
                  <div className='flex items-start gap-4'>
                    <div className='relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/20'>
                      <Bot className='h-6 w-6 text-white' />
                      <span className='border-background absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-emerald-500'>
                        <span className='absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                        <span className='h-1.5 w-1.5 rounded-full bg-white' />
                      </span>
                    </div>

                    <div>
                      <div className='mb-1 flex flex-wrap items-center gap-2'>
                        <h1 className='text-2xl font-bold tracking-tight'>
                          Loan Follow-up Agent
                        </h1>

                        <div className='flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500/15 to-fuchsia-500/15 px-2 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400'>
                          <Sparkles className='h-3 w-3' />
                          AI Powered
                        </div>
                      </div>

                      <p className='text-muted-foreground max-w-2xl text-sm'>
                        Your AI agent generates personalized loan follow-up
                        emails from incoming leads and prepares them for human
                        approval.
                      </p>

                      <div className='text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs'>
                        <div className='flex items-center gap-1.5'>
                          <span className='relative flex h-2 w-2'>
                            <span className='absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                            <span className='relative h-2 w-2 rounded-full bg-emerald-500' />
                          </span>
                          Agent connected
                        </div>

                        <div className='bg-border hidden h-3 w-px sm:block' />

                        <div className='flex items-center gap-1.5'>
                          <Clock3 className='h-3.5 w-3.5' />
                          Last activity:{' '}
                          <span className='text-foreground font-medium'>
                            {formatRelativeTime(
                              agentStats.latestRecord?.createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className='w-[220px] justify-start text-left font-normal'
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />

                            {selectedDate ? (
                              format(selectedDate, 'PPP')
                            ) : (
                              <span className='text-muted-foreground'>
                                Select date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className='w-auto p-0' align='end'>
                          <Calendar
                            mode='single'
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      {selectedDate && (
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => setSelectedDate(undefined)}
                          title='Clear date filter'
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <h2 className='text-sm font-semibold'>Agent activity</h2>
                    <p className='text-muted-foreground text-xs'>
                      View follow-up activity for a specific date.
                    </p>
                  </div>
                </div>

                <div className='bg-background/60 rounded-lg border p-4'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Activity className='h-4 w-4' />
                      <span className='text-sm font-semibold'>
                        Agent workflow
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    {PIPELINE_STEPS.map((step: any, i) => (
                      <div
                        key={step.label}
                        className='flex flex-1 items-center gap-3'
                      >
                        <div
                          className={`flex flex-1 items-center gap-3 rounded-lg border p-3 ring-1 ${step.ring} ${
                            step?.glow ? 'shadow-md shadow-violet-500/20' : ''
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${step.bg}`}
                          >
                            <step.icon
                              className={`h-4 w-4 ${step.icon_color}`}
                            />
                          </div>
                          <div className='min-w-0'>
                            <p className='text-xs font-medium'>{step.label}</p>
                            <p className='text-muted-foreground text-xs'>
                              {step.desc}
                            </p>
                          </div>
                        </div>

                        {i < PIPELINE_STEPS.length - 1 && (
                          <ArrowRight className='text-muted-foreground/40 hidden h-4 w-4 shrink-0 sm:block' />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                  {METRICS.map((m) => (
                    <div
                      key={m.key}
                      className='relative overflow-hidden rounded-lg border p-3'
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${m.from} ${m.to}`}
                      />
                      <p className='text-muted-foreground text-xs'>{m.label}</p>
                      <p
                        className={`mt-1 bg-gradient-to-r ${m.from} ${m.to} bg-clip-text text-xl font-semibold text-transparent`}
                      >
                        {agentStats[m.key as keyof typeof agentStats] as number}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {isFetchingRecords ? (
          <DataTableSkeleton />
        ) : (
          <div className='space-y-3'>
            <div className='flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-semibold'>
                    Agent-generated records
                  </h2>
                  <div className='flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
                    <span className='relative flex h-1.5 w-1.5'>
                      <span className='absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
                      <span className='relative h-1.5 w-1.5 rounded-full bg-emerald-500' />
                    </span>
                    Live
                  </div>
                </div>
                <p className='text-muted-foreground text-sm'>
                  AI-generated follow-up emails waiting for workflow action.
                </p>
              </div>

              {agentStats.latestRecord && (
                <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                  <Clock3 className='h-3.5 w-3.5' />
                  Last generated{' '}
                  <span className='text-foreground font-medium'>
                    {formatAgentDate(agentStats.latestRecord.createdAt)}
                  </span>
                </div>
              )}
            </div>

            <Records data={records || []} />
          </div>
        )}
      </Main>

      <RecordDetailDialog />
    </TasksProvider>
  )
}
