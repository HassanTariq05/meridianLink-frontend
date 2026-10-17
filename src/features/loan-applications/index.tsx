import { useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  Mic,
  Phone,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useLoanApplications } from '@/hooks/use-loan-applications'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
  getApplicationColumns,
  type LoanApplication,
} from './components/loan-application-columns'
import ApplicationDialog from './components/loan-application-dialog'
import { LoanApplicationsTable } from './components/loan-application-table'

const METRIC_CONFIG = [
  {
    key: 'total',
    label: 'Total applications',
    icon: Activity,
    accent: 'from-sky-500 to-cyan-500',
    iconStyle: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    key: 'new',
    label: 'New applications',
    icon: UserRound,
    accent: 'from-violet-500 to-fuchsia-500',
    iconStyle: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    key: 'callbacks',
    label: 'Callbacks to follow up',
    icon: Phone,
    accent: 'from-amber-500 to-orange-500',
    iconStyle: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
] as const

export function LoanApplicationsView() {
  const {
    data: applicationsData,
    isLoading: isLoadingApplications,
    isError,
    refetch,
  } = useLoanApplications()

  const applications: any = useMemo(
    () => applicationsData ?? [],
    [applicationsData]
  )

  const [selected, setSelected] = useState<LoanApplication | null>(null)

  const stats = useMemo(() => {
    const newApplications = applications.filter(
      (application: LoanApplication) =>
        (application.status || '').toLowerCase() === 'new'
    ).length

    const callbacksNeeded = applications.filter(
      (application: LoanApplication) => {
        const status = (application.status || '').toLowerCase()
        return !['approved', 'rejected', 'completed', 'closed'].includes(status)
      }
    ).length

    return {
      total: applications.length,
      new: newApplications,
      callbacks: callbacksNeeded,
    }
  }, [applications])

  const applicationColumns = useMemo(
    () => getApplicationColumns(setSelected),
    []
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

      <Main className='flex flex-1 flex-col gap-5 py-0 pb-3'>
        {/* Page heading */}
        <section className='pt-1'>
          <div className='bg-card relative overflow-hidden rounded-xl border'>
            <div className='pointer-events-none absolute -top-20 -right-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl' />
            <div className='pointer-events-none absolute -bottom-20 -left-12 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl' />

            <div className='relative flex items-center gap-3 p-4 sm:p-3'>
              <div className='relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 shadow-sm shadow-violet-500/20'>
                <Mic className='h-4.5 w-4.5 text-white' />
                <span className='border-background absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 bg-emerald-500'>
                  <span className='relative h-1.5 w-1.5 rounded-full bg-white' />
                </span>
              </div>

              <div className='min-w-0 flex-1'>
                <div className='mb-1 flex flex-wrap items-center gap-2'>
                  <h1 className='text-md sm:text-md font-semibold tracking-tight'>
                    Voice Agent — Loan Applications
                  </h1>
                  <Badge
                    variant='outline'
                    className='gap-1 border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300'
                  >
                    <Sparkles className='h-3 w-3' />
                    AI-powered
                  </Badge>
                </div>
                <p className='text-muted-foreground text-xs leading-4'>
                  Review loan requests and manage customer callback follow-ups
                  captured by your voice agent.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
          {METRIC_CONFIG.map((metric) => (
            <Card
              key={metric.key}
              className='relative overflow-hidden rounded-xl shadow-none'
            >
              <div
                className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${metric.accent}`}
              />
              <CardContent className='flex items-center justify-between gap-3 p-5 py-0'>
                <div className='min-w-0'>
                  <p className='text-muted-foreground text-xs'>
                    {metric.label}
                  </p>
                  <p className='mt-1 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl'>
                    {isLoadingApplications ? '—' : stats[metric.key]}
                  </p>
                </div>
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${metric.iconStyle}`}
                >
                  <metric.icon className='h-4 w-4' />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Separator />

        <section className='space-y-3'>
          {isLoadingApplications ? (
            <div className='bg-muted/30 h-64 animate-pulse rounded-xl border' />
          ) : isError ? (
            <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center'>
              <AlertCircle className='text-destructive h-8 w-8' />
              <p className='text-sm font-medium'>
                Unable to load loan applications.
              </p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => void refetch()}
              >
                Try again
              </Button>
            </div>
          ) : (
            <LoanApplicationsTable
              data={applications}
              columns={applicationColumns}
              searchPlaceholder='Search application ID, customer, phone, or loan type…'
            />
          )}
        </section>

        <ApplicationDialog selected={selected} setSelected={setSelected} />
      </Main>
    </>
  )
}
