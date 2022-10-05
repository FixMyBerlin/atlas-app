import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import React from 'react'

export const HeaderRegionenLogo: React.FC = () => {
  const {
    data: { region },
  } = useMatch<LocationGenerics>()

  if (!region) return null

  return (
    <>
      <BuildingLibraryIcon className="block h-8 w-auto text-yellow-400 lg:hidden" />
      <BuildingLibraryIcon className="hidden h-8 w-auto text-yellow-400 lg:block" />
      <span className="ml-2 text-yellow-400"> {region.name}</span>
    </>
  )
}
