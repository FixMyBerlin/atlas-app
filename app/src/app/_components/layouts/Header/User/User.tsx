import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import { RemoveCookie } from './RemoveCookie'
import { UserLoggedIn } from './UserLoggedIn'
import { UserLoggedOut } from './UserLoggedOut'

export const User = () => {
  const user = useCurrentUser()
  return (
    <>
      {user ? <UserLoggedIn user={user} /> : <UserLoggedOut />}
      <RemoveCookie />
    </>
  )
}
