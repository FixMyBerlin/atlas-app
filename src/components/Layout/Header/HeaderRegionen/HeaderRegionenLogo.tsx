import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import classNames from 'classnames'
import React from 'react'

export const HeaderRegionenLogo: React.FC = () => {
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  if (!region) return null

  return (
    <>
      {region.logo ? (
        region.logo
      ) : (
        <>
          <BuildingLibraryIcon className="block h-8 w-auto text-yellow-400 lg:hidden" />
          <BuildingLibraryIcon className="hidden h-8 w-auto text-yellow-400 lg:block" />
        </>
      )}
      <span
        className={classNames(
          'ml-2',
          region.logo ? 'text-gray-400' : 'text-yellow-400'
        )}
      >
        Radverkehrsatlas{' '}
        <span className="hidden md:inline">{region.fullName}</span>
      </span>
    </>
  )
}
