import { invoke } from 'src/blitz-server'
import getRegion from 'src/regions/queries/getRegion'
import { MapInterface } from './_components/MapInterface'
import { MapInterfaceInitialization } from './_components/MapInterfaceInitialization'

export async function generateMetadata({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `${region?.fullName} im Radverkehrsatlas` },
  }
}

export default function ShowRegionPage() {
  console.log('## ShowRegionPage rendered')
  return (
    <MapInterfaceInitialization>
      <MapInterface />
    </MapInterfaceInitialization>
  )
}
