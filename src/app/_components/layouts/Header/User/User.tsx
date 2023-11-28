import React from 'react'
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import { UserLoggedIn } from './UserLoggedIn'
import { UserLoggedOut } from './UserLoggedOut'
import { RemoveCookie } from './RemoveCookie'

export const User: React.FC = () => {
  const user = useCurrentUser()
  return (
    <>
      {user ? <UserLoggedIn user={user} /> : <UserLoggedOut />}
      <RemoveCookie />
    </>
  )
}
