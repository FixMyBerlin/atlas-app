import { useStaticRegion } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useStaticRegion'
import { productName } from '@/src/data/tildaProductNames.const'
import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { twJoin } from 'tailwind-merge'

export const HeaderRegionenLogo = () => {
  const region = useStaticRegion()

  if (!region) return null

  const customLogo = region.logoPath || region.externalLogoPath

  return (
    <>
      {customLogo && (
        <div
          className={twJoin(
            region.logoWhiteBackgroundRequired ? 'rounded-sm bg-white px-1 py-1' : '',
          )}
        >
          {region.externalLogoPath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={region.externalLogoPath} className="h-8 w-auto" alt="" />
          )}
          {region.logoPath && (
            // local files
            <Image src={region.logoPath} className="h-8 w-auto" alt="" />
          )}
        </div>
      )}

      {!customLogo && (
        <>
          <BuildingLibraryIcon className="block h-8 w-auto text-yellow-400 lg:hidden" />
          <BuildingLibraryIcon className="hidden h-8 w-auto text-yellow-400 lg:block" />
        </>
      )}

      <div className="ml-3 truncate leading-tight">
        <div className={twJoin('truncate', customLogo ? 'text-gray-200' : 'text-yellow-400')}>
          <span className="md:hidden">{region.name}</span>
          <span className="hidden md:inline">{region.fullName}</span>
        </div>
        <div className="text-xs text-gray-400">{productName.get(region.product)}</div>
      </div>
    </>
  )
}
