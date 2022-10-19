import React, { useEffect } from 'react'
// @ts-ignore but it works
import { osmAuth } from 'osm-auth'
import useUserStore from '@components/MapInterface/UserInfo/useUserStore'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import LoggedIn from './LoggedIn'
import { useMatch } from '@tanstack/react-location'
import { LocationGenerics } from '@routes/routes'

const redirectPath = window.location.origin
const redirectUri = `${redirectPath}/auth.html`

const auth = osmAuth({
  client_id: 'hj0UJ1sYG-DyUBWpLuod2cJUCJD6SavqRixv41HUAas',
  client_secret: '-DNqxx2g3W-dvskxf6qKXIEWfhtpmW3Fayp21gGWXMs',
  scope: 'read_prefs',
  redirect_uri: redirectUri,
})

const parseResponse = (result: XMLDocument) => {
  const user = result.getElementsByTagName('user')[0]
  const changeSets = result.getElementsByTagName('changesets')[0]
  const img = result.getElementsByTagName('img')[0]
  // @ts-ignore let's not overcomplicate things
  const avatar = img ? img.attributes.href.value : null
  const displayName = user.getAttribute('display_name')
  const userId = Number(user.getAttribute('id'))
  const count = changeSets.getAttribute('count')
  return { user, changeSets, avatar, displayName, userId, count }
}

export const User: React.FC = () => {
  const user = useUserStore((state) => state.currentUser)
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)
  const removeCurrentUser = useUserStore((state) => state.removeCurrentUser)

  const { region } = useMatch<LocationGenerics>().data
  const hasPermissions =
    !!user && !!region ? region.osmUsers.includes(user.id) : false

  useEffect(() => {
    update()
  }, [])

  const login = (): void => {
    if (!auth.bringPopupWindowToFront()) {
      auth.authenticate(function () {
        update()
      })
    }
  }

  const logout = (): void => {
    auth.logout()
    removeCurrentUser()
  }

  const update = (): void => {
    if (auth.authenticated()) {
      auth.xhr({ method: 'GET', path: '/api/0.6/user/details' }, done)
    } else {
      console.error('Auth failed')
    }
  }

  const done = (err: XMLHttpRequest | null, result: XMLDocument): void => {
    if (err) {
      console.error(
        `Error! Try clearing your browser cache. (${err.responseText}`
      )
      return
    }
    const data = parseResponse(result)
    const { userId: id, displayName, avatar } = data
    setCurrentUser({ id, displayName, avatar })
  }

  const btnClassName =
    'text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'

  return (
    <div className="hidden sm:ml-6 sm:block">
      {!user ? (
        <button className={btnClassName} onClick={login}>
          <UserCircleIcon className="h-8 w-8" />
        </button>
      ) : (
        <LoggedIn
          user={user}
          hasPermissions={hasPermissions}
          onLogout={logout}
        />
      )}
    </div>
  )
}
