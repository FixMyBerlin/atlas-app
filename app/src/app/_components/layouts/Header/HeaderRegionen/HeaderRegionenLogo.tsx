import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useRegion'
import { twJoin } from 'tailwind-merge'

export const HeaderRegionenLogo = () => {
  const region = useRegion()

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
            <img src={region.externalLogoPath} className="h-6 w-auto" alt="" />
          )}
          {region.logoPath && (
            // local files
            <Image src={region.logoPath} className="h-6 w-auto" alt="" />
          )}
        </div>
      )}

      {!customLogo && (
        <>
          <BuildingLibraryIcon className="block h-8 w-auto text-yellow-400 lg:hidden" />
          <BuildingLibraryIcon className="hidden h-8 w-auto text-yellow-400 lg:block" />
        </>
      )}

      <span className={twJoin('ml-2', customLogo ? 'text-gray-400' : 'text-yellow-400')}>
        Radverkehrsatlas (beta) <span className="hidden md:inline">{region.fullName}</span>
      </span>
    </>
  )
}
