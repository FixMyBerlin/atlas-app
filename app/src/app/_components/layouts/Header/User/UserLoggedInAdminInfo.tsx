import { Link } from 'src/app/_components/links/Link'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { linkStyles } from 'src/app/_components/links/styles'
import {
  googleMapsUrlViewport,
  mapillaryUrlViewport,
  osmUrlViewport,
} from 'src/app/regionen/[regionSlug]/_components/SidebarInspector/Tools/osmUrls/osmUrls'
import { useMapDebugActions } from 'src/app/regionen/[regionSlug]/_hooks/mapState/useMapDebugState'
import { useMapParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import { isAdmin } from 'src/users/components/utils/usersUtils'
import { UserLoggedInProp } from './UserLoggedIn'
import { getAdminInfoEnvUrl } from './utils/getAdminInfoEnvUrl'

export const UserLoggedInAdminInfo = ({ user }: UserLoggedInProp) => {
  const { toggleShowDebugInfo } = useMapDebugActions()

  const { mapParam } = useMapParam()
  const osmUrlViewportUrl = mapParam && osmUrlViewport(mapParam.zoom, mapParam.lat, mapParam.lng)
  const mapillaryUrlViewportUrl =
    mapParam && mapillaryUrlViewport(mapParam.zoom, mapParam.lat, mapParam.lng)
  const googleMapsViewportUrl =
    mapParam && googleMapsUrlViewport(mapParam.zoom, mapParam.lat, mapParam.lng)

  const devUrl = getAdminInfoEnvUrl('development')
  const stagingUrl = getAdminInfoEnvUrl('staging')
  const prodUrl = getAdminInfoEnvUrl('production')

  if (!isAdmin(user)) return null

  return (
    <div className="bg-pink-300 px-4 py-2 text-xs leading-5">
      <p>
        Du bist <strong>Admin</strong>.
      </p>

      <ul>
        <li>
          <Link href="/admin">Admin Bereich</Link>
        </li>
        {mapParam && (
          <li>
            <button type="button" onClick={() => toggleShowDebugInfo()} className={linkStyles}>
              Toggle <code>mapDebug</code>
            </button>
          </li>
        )}
        <li>
          {devUrl && (
            <LinkExternal blank href={devUrl}>
              Open DEV
            </LinkExternal>
          )}
        </li>
        <li>
          {stagingUrl && (
            <LinkExternal blank href={stagingUrl}>
              Open Staging
            </LinkExternal>
          )}
        </li>
        <li>
          {prodUrl && (
            <LinkExternal blank href={prodUrl}>
              Open Production
            </LinkExternal>
          )}
        </li>
        {osmUrlViewportUrl && (
          <li>
            <LinkExternal blank href={osmUrlViewportUrl}>
              Open OSM
            </LinkExternal>
          </li>
        )}
        {mapillaryUrlViewportUrl && (
          <li>
            <LinkExternal blank href={mapillaryUrlViewportUrl}>
              Open Mapillary
            </LinkExternal>
          </li>
        )}
        {googleMapsViewportUrl && (
          <li>
            <LinkExternal blank href={googleMapsViewportUrl}>
              Open GoogleMaps
            </LinkExternal>
          </li>
        )}
      </ul>
    </div>
  )
}
