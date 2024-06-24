import 'server-only'
import { invoke } from 'src/blitz-server'
import getRegions from 'src/regions/queries/getRegionsWithAdditionalData'
import getCurrentUser from 'src/users/queries/getCurrentUser'
import { RegionTeaser } from './RegionTeaser'

export const RegionListPermissions = async () => {
  const user = await invoke(getCurrentUser, null)
  if (!user?.id || !user?.role) return null

  // Has to be below the role check.
  const permissionsRegions = await invoke(getRegions, {
    where: { Membership: { some: { userId: user.id } } },
  })

  return (
    <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
      <div className="prose mt-5">
        <h2>Regionen, zu denen Sie Zugang haben</h2>
      </div>

      <div className="my-10 grid grid-cols-2 border-l border-t border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
        {permissionsRegions?.map((region) => <RegionTeaser key={region.slug} region={region} />)}
        {permissionsRegions?.length === 0 && (
          <div className="p-4 font-semibold text-gray-400">Keine Regionen</div>
        )}
      </div>
    </div>
  )
}
