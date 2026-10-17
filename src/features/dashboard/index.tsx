import { ArrowRight, Bot, Workflow, Zap } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function Dashboard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='flex min-h-[calc(100vh-8rem)] flex-col'>
          <section className='relative flex flex-1 items-center justify-center overflow-hidden py-6 md:py-6'>
            <div
              className='pointer-events-none absolute inset-0 -z-10'
              aria-hidden='true'
            >
              <div
                className='absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl'
                style={{
                  backgroundColor: isDark
                    ? 'rgba(205, 241, 64, 0.08)'
                    : 'rgba(82, 112, 0, 0.07)',
                }}
              />
            </div>

            <div className='mx-auto w-full max-w-4xl text-center'>
              <Badge
                variant='outline'
                className='mb-6 gap-2 rounded-full px-4 py-2 text-sm'
              >
                <Zap
                  className='h-4 w-4'
                  style={{
                    color: isDark ? '#CDF140' : '#527000',
                  }}
                />
                Intelligent Automation. Real Business Impact.
              </Badge>

              <h1 className='mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
                Empowering Businesses
                <span className='mt-2 block'>
                  with{' '}
                  <span
                    style={{
                      color: isDark ? '#CDF140' : '#527000',
                    }}
                  >
                    AI Innovation
                  </span>
                </span>
              </h1>

              <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-base leading-8 sm:text-lg'>
                Build smarter, move faster, and scale with confidence.
                Informechs helps businesses transform complex processes into
                intelligent AI agents and automated workflows, backed by
                enterprise technology and data-driven insights.
              </p>

              {/* Primary actions */}
              <div className='mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row'>
                <Button
                  size='lg'
                  className='gap-2 rounded-xl px-6'
                  onClick={() =>
                    window.open('https://informechs.com/contact', '_blank')
                  }
                >
                  Let's Build Something Smart
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </div>

              {/* Solution cards */}
              <div
                id='our-solutions'
                className='grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3'
              >
                <div className='bg-card/70 hover:bg-card rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
                  <div
                    className='mb-5 flex h-11 w-11 items-center justify-center rounded-xl'
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(205, 241, 64, 0.12)'
                        : 'rgba(82, 112, 0, 0.10)',
                      color: isDark ? '#CDF140' : '#527000',
                    }}
                  >
                    <Bot className='h-5 w-5' />
                  </div>

                  <h2 className='mb-2 text-lg font-semibold'>AI Agents</h2>
                  <p className='text-muted-foreground text-sm leading-6'>
                    Intelligent agents that understand requests, assist
                    customers, and streamline business operations.
                  </p>
                </div>

                <div className='bg-card/70 hover:bg-card rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
                  <div
                    className='mb-5 flex h-11 w-11 items-center justify-center rounded-xl'
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(205, 241, 64, 0.12)'
                        : 'rgba(82, 112, 0, 0.10)',
                      color: isDark ? '#CDF140' : '#527000',
                    }}
                  >
                    <Workflow className='h-5 w-5' />
                  </div>

                  <h2 className='mb-2 text-lg font-semibold'>
                    Workflow Automation
                  </h2>
                  <p className='text-muted-foreground text-sm leading-6'>
                    Connect your tools, eliminate repetitive tasks, and build
                    efficient end-to-end workflows.
                  </p>
                </div>

                <div className='bg-card/70 hover:bg-card rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1'>
                  <div
                    className='mb-5 flex h-11 w-11 items-center justify-center rounded-xl'
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(205, 241, 64, 0.12)'
                        : 'rgba(82, 112, 0, 0.10)',
                      color: isDark ? '#CDF140' : '#527000',
                    }}
                  >
                    <Zap className='h-5 w-5' />
                  </div>

                  <h2 className='mb-2 text-lg font-semibold'>
                    Enterprise Solutions
                  </h2>
                  <p className='text-muted-foreground text-sm leading-6'>
                    From AWS and Salesforce consulting to ERP, data analytics,
                    and cybersecurity, build on a stronger technology
                    foundation.
                  </p>
                </div>
              </div>

              {/* Closing statement */}
              <p className='text-muted-foreground mt-10 text-sm'>
                Innovation. Accuracy. Speed.{' '}
                <span className='text-foreground font-medium'>
                  That's the Informechs approach.
                </span>
              </p>
            </div>
          </section>
        </div>
      </Main>
    </>
  )
}
