import { invoke } from '@blitzjs/rpc'
import getRegions from 'src/regions/queries/getRegions'
import getCurrentUser from 'src/users/queries/getCurrentUser'
import { RegionTeaser } from './RegionTeaser'

export const RegionListNonpublic = async () => {
  const user = await invoke(getCurrentUser, null)
  if (user?.role !== 'ADMIN') return null

  // Has to be below the role check.
  const regions = await invoke(getRegions, { where: { public: false } })

  return (
    <div className="bg-pink-200">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <div className="prose mt-5">
          <h2>Nicht veröffentlichte Regionen</h2>
        </div>

        <div className="my-10 grid grid-cols-2 border-l border-t border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {regions?.map((region) => <RegionTeaser key={region.slug} region={region} />)}
        </div>
      </div>
    </div>
  )
}
