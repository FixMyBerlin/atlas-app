import { invoke } from 'src/blitz-server'
import getPublicRegion from 'src/regions/queries/getPublicRegion'
import { MapInterface } from './_components/MapInterface'
import { MapInterfaceInitialization } from './_components/MapInterfaceInitialization'

export async function generateMetadata({ params }) {
  const region = await invoke(getPublicRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `${region?.fullName} im Radverkehrsatlas` },
  }
}

export default function ShowRegionPage() {
  return (
    <MapInterfaceInitialization>
      <MapInterface />
    </MapInterfaceInitialization>
  )
}

ShowRegionPage.authenticate = false
