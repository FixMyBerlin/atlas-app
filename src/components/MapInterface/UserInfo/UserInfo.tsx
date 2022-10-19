import React from 'react'
import useUserStore from './useUserStore'
import { useMatch } from '@tanstack/react-location'
import { LocationGenerics } from '@routes/routes'

export const UserInfo: React.FC = () => {
  const user = useUserStore((state) => state.currentUser)
  const { region } = useMatch<LocationGenerics>().data
  const hasPermissions =
    !!user && !!region ? region.osmUsers.includes(user.id) : false

  return (
    <div className="absolute bottom-14 right-5 border-2 border-red-600 p-2">
      {user ? (
        <>
          <div>User ID: {user.id}</div>
          <div>Username: {user.displayName}</div>
          <div>{JSON.stringify(hasPermissions)}</div>
        </>
      ) : (
        <div>No User</div>
      )}
    </div>
  )
}
