'use client'

import { useQuery } from '@blitzjs/rpc'
import getPublicRegions from 'src/regions/queries/getPublicRegions'
import { RegionTeaser } from './RegionTeaser'

export const PublicRegionList = () => {
  const [regions] = useQuery(getPublicRegions, {})

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Regionen</h2>

        <div className="my-10 grid grid-cols-2 border-l border-t border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {regions?.map((region) => <RegionTeaser key={region.slug} region={region} />)}
        </div>
      </div>
    </div>
  )
}
