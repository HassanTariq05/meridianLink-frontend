import { ReactNode, useState } from 'react'
import { Loader2 } from 'lucide-react'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const { auth } = useAuthStore()
  const [loading] = useState(true)
  // const navigator = useRouter()

  // useEffect(() => {
  //   const init = async () => {
  //     if (!auth.accessToken) {
  //       setLoading(false)
  //       navigator.navigate({ to: '/sign-in' })
  //     }

  //     try {
  //       const { data } = await axios.get(
  //         `${import.meta.env.VITE_AUTH_BASE_URL}/me`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${auth.accessToken}`,
  //           },
  //         }
  //       )
  //       auth.setUser(data.user)
  //     } catch (err) {
  //       auth.reset()
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   init()
  // }, [])

  if (loading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Loader2 className='text-muted-foreground h-10 w-10 animate-spin' />
      </div>
    )
  }

  return <>{children}</>
}
