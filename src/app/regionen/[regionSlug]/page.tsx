import { invoke } from 'src/blitz-server'
import getRegion from 'src/regions/queries/getRegion'
import { MapInterface } from './_components/MapInterface'

export async function generateMetadata({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `${region?.fullName} im Radverkehrsatlas` },
  }
}

export default function ShowRegionPage() {
  return (
    <>
      <MapInterface />
    </>
  )
}
