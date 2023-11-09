import { BuildingLibraryIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { TRegion } from 'src/regions/queries/getRegion'

type Props = { region: TRegion }

export const RegionTeaser = ({ region }: Props) => {
  return (
    <Link href={`/regionen/${region.slug}`}>
      <div
        key={region.slug}
        className="group relative border-b border-r border-gray-200 p-4 hover:bg-yellow-50 sm:p-6"
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
        <div className="pb-4 pt-10 text-center">
          <h3 className="text-xl font-medium text-gray-900">
            Radverkehrsatlas <br />
            {region.fullName}
          </h3>
        </div>
      </div>
    </Link>
  )
}
