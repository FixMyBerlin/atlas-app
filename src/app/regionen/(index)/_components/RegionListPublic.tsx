'use client'

import { invoke } from '@blitzjs/rpc'
import getRegions from 'src/regions/queries/getRegionsWithAdditionalData'
import { RegionTeaser } from './RegionTeaser'

export const RegionListPublic = async () => {
  const publicRegions = await invoke(getRegions, { where: { public: true } })

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Regionen</h2>

        <div className="my-10 grid grid-cols-2 border-l border-t border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {publicRegions?.map((region) => <RegionTeaser key={region.slug} region={region} />)}
          {publicRegions?.length === 0 && (
            <div className="p-4 font-semibold text-gray-400">Keine Regionen</div>
          )}
        </div>
      </div>
    </div>
  )
}
