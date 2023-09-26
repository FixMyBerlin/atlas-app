import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { TPublicRegion } from 'src/regions/queries/getPublicRegions'

type Props = { region: TPublicRegion }

export const PageRegionsRegionTeaser: React.FC<Props> = ({ region }) => {
  return (
    <Link href={`/regionen/${region.slug}`}>
      <div
        key={region.slug}
        className="group relative border-r border-b border-gray-200 p-4 hover:bg-yellow-50 sm:p-6"
      >
        <div className="aspect-auto h-20 overflow-hidden rounded-lg border border-gray-200 bg-white group-hover:opacity-75">
          <span className="flex h-full w-full items-center justify-center object-cover object-center py-2">
            {region.logoPath ? (
              <Image src={region.logoPath} className="max-h-full w-auto" alt="" />
            ) : (
              <BuildingLibraryIcon className="block h-20 w-auto" />
            )}
          </span>
        </div>
        <div className="pt-10 pb-4 text-center">
          <h3 className="text-xl font-medium text-gray-900">
            Radverkehrsatlas <br />
            {region.fullName}
          </h3>
        </div>
      </div>
    </Link>
  )
}
