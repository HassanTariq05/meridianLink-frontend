import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'

export function LogoCollapsed({ className }: { className?: string }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const accentColor = isDark ? '#CDF140' : '#527000'

  return (
    <span
      className={cn(
        'text-fg inline-flex items-center gap-2 text-[22px] font-bold tracking-[0.01em]',
        className
      )}
    >
      <svg
        viewBox='0 0 28 28'
        className='h-[1.15em] w-auto shrink-0'
        aria-hidden='true'
      >
        <path
          d='M14 2.2 24.6 8.1v11.8L14 25.8 3.4 19.9V8.1z'
          fill='none'
          stroke={accentColor}
          strokeWidth='1.7'
          strokeLinejoin='round'
        />
        <path
          d='M9.6 17.8V10.2l4.4 4.1 4.4-4.1v7.6'
          fill='none'
          stroke={accentColor}
          strokeWidth='1.9'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </span>
  )
}
