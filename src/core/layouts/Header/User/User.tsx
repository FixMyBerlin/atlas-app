import React, { useCallback, useEffect } from 'react'
// @ts-ignore but it works
import { useParam } from '@blitzjs/next'
import { hasPermission } from 'src/core/components/MapInterface/UserInfo'
import { useUserStore } from 'src/core/components/MapInterface/UserInfo/useUserStore'
import { regions } from 'src/regions/components/additionalRegionAttributes.const'
import { UserIcon } from '@heroicons/react/24/outline'
import { osmAuth } from 'osm-auth'
import { LoggedIn } from './LoggedIn'

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
  const displayName = user?.getAttribute('display_name')
  const userId = Number(user?.getAttribute('id'))
  const count = changeSets?.getAttribute('count')
  return { user, changeSets, avatar, displayName, userId, count }
}

export const User: React.FC = () => {
  const user = useUserStore((state) => state.currentUser)
  const setCurrentUser = useUserStore((state) => state.setCurrentUser)
  const removeCurrentUser = useUserStore((state) => state.removeCurrentUser)

  const regionPath = useParam('regionSlug', 'string')
  const region = regions.find((r) => r.path === regionPath)
  const hasPermissions = hasPermission(user, region)

  const update = useCallback(() => {
    const done = (err: XMLHttpRequest | null, result: XMLDocument): void => {
      if (err) {
        console.error(`Error! Try clearing your browser cache. (${err.responseText}`)
        return
      }
      const data = parseResponse(result)
      const { userId: id, displayName, avatar } = data
      setCurrentUser({ id, displayName, avatar })
    }

    if (auth.authenticated()) {
      auth.xhr({ method: 'GET', path: '/api/0.6/user/details' }, done)
    } else {
      console.error('Auth failed')
    }
  }, [setCurrentUser])

  useEffect(() => {
    update()
  }, [update])

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

  return (
    <div className="sm:ml-6">
      {!user ? (
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:border sm:border-gray-700"
          onClick={login}
        >
          <span className="sr-only">Anmelden</span>
          <UserIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      ) : (
        <LoggedIn user={user} hasPermissions={hasPermissions} onLogout={logout} />
      )}
    </div>
  )
}
