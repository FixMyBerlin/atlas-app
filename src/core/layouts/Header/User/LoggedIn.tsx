import { Link, linkStyles } from 'src/core/components/links'
import {
  mapillaryUrlViewport,
  osmUrlViewport,
} from 'src/core/components/MapInterface/Inspector/Tools/osmUrls'
import { useMapDebugState } from 'src/core/components/MapInterface/mapStateInteraction/useMapDebugState'
import { User } from 'src/core/components/MapInterface/UserInfo'
import { getEnvUrl } from 'src/core/utils/getEnvUrl'
import { isAdmin } from 'src/users/components/utils'
import { Menu, Transition } from '@headlessui/react'
import { CheckBadgeIcon, UserIcon } from '@heroicons/react/24/solid'
import { LocationGenerics } from 'src/TODO-MIRGRATE-REMOVE/routes'
import { useSearch } from '@tanstack/react-location'
import { clsx } from 'clsx'
import React, { Fragment } from 'react'

type Props = {
  user: User
  hasPermissions: boolean
  onLogout: () => void
}

export const LoggedIn: React.FC<Props> = ({ user, hasPermissions, onLogout }) => {
  const { toggleShowDebugInfo } = useMapDebugState()
  const imgSrc = user.avatar ? user.avatar : null

  const devUrl = getEnvUrl('development')
  const stagingUrl = getEnvUrl('staging')
  const prodUrl = getEnvUrl('production')

  const { zoom, lat, lng } = useSearch<LocationGenerics>()
  const osmUrlViewportUrl = osmUrlViewport(zoom, lat, lng)
  const mapillaryUrlViewportUrl = mapillaryUrlViewport(zoom, lat, lng)

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="flex rounded-full bg-gray-800 text-sm hover:ring-1 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">User-Menü</span>
        {imgSrc ? (
          <img className="h-8 w-8 rounded-full" src={imgSrc} alt="" aria-hidden="true" />
        ) : (
          <UserIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
        )}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700">
            <p className="mb-1">
              <strong>Angemeldet als {user.displayName}</strong>
            </p>
            {hasPermissions ? (
              <div className="flex items-center gap-1 text-xs leading-4">
                <CheckBadgeIcon className="inline-block h-6 w-6" />
                <span>Sie sind Mitarbeiter dieser Region</span>
              </div>
            ) : (
              <div className="text-xs leading-4">
                Sie haben zur Zeit keine Zugriffsrechte in dieser Region.
              </div>
            )}
          </div>
          {isAdmin(user) && (
            <ul className="bg-pink-300 px-4 py-2 text-sm">
              <li>OSM ID {user.id}</li>
              <li>
                <button type="button" onClick={() => toggleShowDebugInfo()} className={linkStyles}>
                  Toggle <code>mapDebug</code>
                </button>
              </li>
              <li>
                {devUrl && (
                  <Link external blank to={devUrl}>
                    Open DEV
                  </Link>
                )}
              </li>
              <li>
                {stagingUrl && (
                  <Link external blank to={stagingUrl}>
                    Open Staging
                  </Link>
                )}
              </li>
              <li>
                {prodUrl && (
                  <Link external blank to={prodUrl}>
                    Open Production
                  </Link>
                )}
              </li>
              {osmUrlViewportUrl && (
                <li>
                  <Link external blank to={osmUrlViewportUrl}>
                    Open OSM
                  </Link>
                </li>
              )}
              {mapillaryUrlViewportUrl && (
                <li>
                  <Link external blank to={mapillaryUrlViewportUrl}>
                    Open Mapillary
                  </Link>
                </li>
              )}
            </ul>
          )}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onLogout}
                className={clsx(
                  active ? 'bg-gray-100' : '',
                  'w-full px-4 py-2 text-left text-sm text-gray-700',
                )}
              >
                Ausloggen
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
