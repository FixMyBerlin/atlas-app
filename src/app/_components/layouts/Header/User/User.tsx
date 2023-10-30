import React from 'react'
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import { UserLoggedIn } from './UserLoggedIn'
import { UserLoggedOut } from './UserLoggedOut'

export const User: React.FC = () => {
  const user = useCurrentUser()

  if (user) {
    return <UserLoggedIn user={user} />
  }

  return <UserLoggedOut />
}
