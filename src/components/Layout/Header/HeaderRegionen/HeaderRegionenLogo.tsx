import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import { clsx } from 'clsx'
import React from 'react'

export const HeaderRegionenLogo: React.FC = () => {
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  if (!region) return null

  return (
    <>
      {region.logoPath ? (
        <div
          className={clsx({
            'rounded-sm bg-white/90 px-1 py-1':
              region.logoWhiteBackgroundRequired,
          })}
        >
          <img src={region.logoPath} className="h-6 w-auto" alt="" />
        </div>
      ) : (
        <>
          <BuildingLibraryIcon className="block h-8 w-auto text-yellow-400 lg:hidden" />
          <BuildingLibraryIcon className="hidden h-8 w-auto text-yellow-400 lg:block" />
        </>
      )}
      <span
        className={clsx(
          'ml-2',
          region.logoPath ? 'text-gray-400' : 'text-yellow-400'
        )}
      >
        Radverkehrsatlas (alpha){' '}
        <span className="hidden md:inline">{region.fullName}</span>
      </span>
    </>
  )
}
