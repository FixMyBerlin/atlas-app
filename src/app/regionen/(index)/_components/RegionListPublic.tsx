'use client'

import { invoke } from '@blitzjs/rpc'
import getRegions from 'src/regions/queries/getRegionsWithAdditionalData'
import { RegionTeaser } from './RegionTeaser'

export const RegionListPublic = async () => {
  const regions = await invoke(getRegions, { where: { public: true } })

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
