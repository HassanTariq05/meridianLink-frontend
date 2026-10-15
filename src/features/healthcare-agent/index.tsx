import { useCallback, useMemo, useState } from 'react'
import {
  Appointment,
  RefillRecord,
} from '@/services/healthcare-agent-services/healthcare-agent-services'
import {
  Activity,
  AlertCircle,
  CalendarDays,
  HeartPulse,
  Pill,
  Sparkles,
} from 'lucide-react'
import {
  useAppointments,
  useMetrics,
  useRefills,
} from '@/hooks/use-healthcare-agent'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { getAppointmentColumns } from './components/appointment-columns'
import { formatStatus } from './components/healthcare-helpers'
import { HealthcareTable } from './components/healthcare-table'
import {
  RecordDetailDialog,
  type SelectedRecord,
} from './components/record-detail-dialog'
import { getRefillColumns } from './components/refill-columns'

type Tab = 'refill' | 'appointments'

const PENDING_PATTERN = /pending|failed|error|rejected|review|action required/i

const METRIC_CONFIG = [
  {
    key: 'total',
    label: 'Total interactions',
    icon: Activity,
    accent: 'from-sky-500 to-cyan-500',
    iconStyle: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    key: 'refills',
    label: 'Prescription refills',
    icon: Pill,
    accent: 'from-violet-500 to-fuchsia-500',
    iconStyle: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    key: 'appointments',
    label: 'Booked appointments',
    icon: CalendarDays,
    accent: 'from-teal-500 to-emerald-500',
    iconStyle: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  },
  {
    key: 'attention',
    label: 'Needs attention',
    icon: AlertCircle,
    accent: 'from-amber-500 to-orange-500',
    iconStyle: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
] as const

export function HealthcareAgentView() {
  const [activeTab, setActiveTab] = useState<Tab>('refill')

  const { data: metrics, isLoading: isLoadingMetrics } = useMetrics()
  const { data: refillsData, isLoading: isLoadingRefills } = useRefills()
  const { data: appointmentsData, isLoading: isLoadingAppointments } =
    useAppointments()

  const refills = useMemo(() => refillsData?.refills ?? [], [refillsData])
  const appointments = useMemo(
    () => appointmentsData?.appointments ?? [],
    [appointmentsData]
  )

  const stats = useMemo(() => {
    const refillCount = metrics?.refills.total ?? refills.length
    const appointmentCount = metrics?.appointments.total ?? appointments.length
    const attention = [...refills, ...appointments].filter((record) =>
      PENDING_PATTERN.test(formatStatus(record.status))
    ).length

    return {
      total: refillCount + appointmentCount,
      refills: refillCount,
      appointments: appointmentCount,
      attention,
    }
  }, [metrics, refills, appointments])

  const [selected, setSelected] = useState<SelectedRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openRecord = useCallback((item: SelectedRecord) => {
    setSelected(item)
    setDialogOpen(true)
  }, [])

  const refillColumns = useMemo(
    () =>
      getRefillColumns((record: RefillRecord) =>
        openRecord({ kind: 'refill', record })
      ),
    [openRecord]
  )

  const appointmentColumns = useMemo(
    () =>
      getAppointmentColumns((record: Appointment) =>
        openRecord({ kind: 'appointment', record })
      ),
    [openRecord]
  )

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 py-0 pb-6 sm:gap-4'>
        <section className='pt-1'>
          <div className='bg-card relative overflow-hidden rounded-xl border'>
            <div className='pointer-events-none absolute -top-24 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent blur-2xl' />
            <div className='pointer-events-none absolute -bottom-24 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-sky-500/10 via-teal-500/5 to-transparent blur-2xl' />

            <div className='relative flex items-center gap-3 p-3 sm:p-3.5'>
              <div className='relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 shadow-sm shadow-violet-500/20'>
                <HeartPulse className='h-4.5 w-4.5 text-white' />
                <span className='border-background absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-emerald-500'>
                  <span className='relative h-1.5 w-1.5 rounded-full bg-white' />
                </span>
              </div>

              <div className='min-w-0 flex-1'>
                <div className='mb-0.5 flex flex-wrap items-center gap-1.5'>
                  <h1 className='text-base font-semibold tracking-tight sm:text-lg'>
                    Healthcare Agent
                  </h1>
                  <Badge
                    variant='outline'
                    className='h-5 gap-1 border-violet-500/25 bg-violet-500/10 px-1.5 text-[10px] text-violet-700 dark:text-violet-300'
                  >
                    <Sparkles className='h-3 w-3' />
                    AI-powered
                  </Badge>
                </div>
                <p className='text-muted-foreground text-xs leading-4'>
                  Manage prescription refills and appointments handled by your
                  healthcare voice agent.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
          {METRIC_CONFIG.map((metric) => (
            <Card
              key={metric.key}
              className='relative overflow-hidden rounded-lg shadow-none'
            >
              <div
                className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${metric.accent}`}
              />
              <CardContent className='flex items-center justify-between gap-2'>
                <div className='min-w-0'>
                  <p className='text-muted-foreground text-[11px] sm:text-xs'>
                    {metric.label}
                  </p>
                  <p className='mt-0.5 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl'>
                    {isLoadingMetrics ? '—' : stats[metric.key]}
                  </p>
                </div>
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${metric.iconStyle}`}
                >
                  <metric.icon className='h-4 w-4' />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Separator />

        <section className='space-y-3'>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as Tab)}
          >
            <TabsList className='bg-muted/70 grid h-9 w-full grid-cols-2 gap-1 rounded-lg p-1 sm:w-fit sm:min-w-[360px]'>
              <TabsTrigger
                value='refill'
                className='gap-1.5 rounded-md px-2 py-1.5 text-xs data-[state=active]:shadow-sm'
              >
                <Pill className='h-3.5 w-3.5 text-violet-600 dark:text-violet-400' />
                <span>Prescription Refill</span>
                <span className='bg-background/80 ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums'>
                  {refills.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value='appointments'
                className='gap-1.5 rounded-md px-2 py-1.5 text-xs data-[state=active]:shadow-sm'
              >
                <CalendarDays className='h-3.5 w-3.5 text-teal-600 dark:text-teal-400' />
                <span>Booked Appointments</span>
                <span className='bg-background/80 ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums'>
                  {appointments.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value='refill'
              className='mt-3 focus-visible:outline-none'
            >
              {isLoadingRefills ? (
                <div className='bg-muted/40 h-64 animate-pulse rounded-lg border' />
              ) : (
                <HealthcareTable
                  data={refills}
                  columns={refillColumns}
                  searchPlaceholder='Search patients, phones, medications…'
                />
              )}
            </TabsContent>

            <TabsContent
              value='appointments'
              className='mt-3 focus-visible:outline-none'
            >
              {isLoadingAppointments ? (
                <div className='bg-muted/40 h-64 animate-pulse rounded-lg border' />
              ) : (
                <HealthcareTable
                  data={appointments}
                  columns={appointmentColumns}
                  searchPlaceholder='Search patients, phones, providers…'
                />
              )}
            </TabsContent>
          </Tabs>
        </section>
        <RecordDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          selected={selected}
        />
      </Main>
    </>
  )
}
