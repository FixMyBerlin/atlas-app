import { additionalRegionAttributes } from 'src/regions/components/additionalRegionAttributes.const'
import { MapInterface } from '../_components/MapInterface/MapInterface'
import { MapInterfaceInitialization } from '../_components/MapInterface/MapInterfaceInitialization'

export async function generateMetadata({ params }) {
  // TODO Migration: Ask in Blitz how to solve this…
  const region = additionalRegionAttributes.find((region) => region.slug === params.regionSlug)
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
