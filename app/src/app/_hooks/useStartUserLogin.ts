import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { cookieName } from '../../server/auth/cookieName'

export const useStartUserLogin = () => {
  const router = useRouter()

  return () => {
    Cookies.set(cookieName, `${location.pathname}${location.search}`)
    void router.push('/api/auth/osm/login')
  }
}
