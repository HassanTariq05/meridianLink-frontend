import { useTheme } from '@/context/theme-provider'
// Import the background image
import LoginBg from '../../../public/images/login-bg.jpg'
import DarkModeLogo from '../../../public/images/logo.png'
import LightModeLogo from '../../../public/images/logo.png'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { theme } = useTheme()

  return (
    <div
      className='bg-fill relative container grid h-svh max-w-none items-center justify-center bg-center bg-no-repeat'
      style={{
        backgroundImage: `url(${LoginBg})`,
      }}
    >
      <div className='bg-card relative z-10 mx-auto flex w-full flex-col justify-center space-y-2 rounded-lg py-8 shadow-lg sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={theme === 'dark' ? DarkModeLogo : LightModeLogo}
              alt='Flux Flow Logo'
              style={{ height: '52px', width: 'auto' }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
