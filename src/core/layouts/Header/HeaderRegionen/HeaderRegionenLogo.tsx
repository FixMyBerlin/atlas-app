import { useParam } from '@blitzjs/next'
import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import Image from 'next/image'
import React from 'react'
import { additionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'

export const HeaderRegionenLogo: React.FC = () => {
  const regionSlug = useParam('regionSlug', 'string')
  const region = additionalRegionAttributes.find((r) => r.slug === regionSlug)

  if (!region) return null

  return (
    <>
      {region.logoPath ? (
        <div
          className={clsx({
            'rounded-sm bg-white px-1 py-1': region.logoWhiteBackgroundRequired,
          })}
        >
          <Image src={region.logoPath} className="h-6 w-auto" alt="" />
        </div>
      ) : (
        <>
          <BuildingLibraryIcon className="block h-8 w-auto text-yellow-400 lg:hidden" />
          <BuildingLibraryIcon className="hidden h-8 w-auto text-yellow-400 lg:block" />
        </>
      )}
      <span className={clsx('ml-2', region.logoPath ? 'text-gray-400' : 'text-yellow-400')}>
        Radverkehrsatlas (beta) <span className="hidden md:inline">{region.fullName}</span>
      </span>
    </>
  )
}
