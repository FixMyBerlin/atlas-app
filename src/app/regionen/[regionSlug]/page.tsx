import { invoke } from 'src/blitz-server'
import getRegion from 'src/regions/queries/getRegion'
import { MapInterface } from './_components/MapInterface'
import { createInitialCategoriesConfig } from './_components/mapStateConfig/createMapRegionConfig'

export async function generateMetadata({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `${region?.fullName} im Radverkehrsatlas` },
  }
}

export default async function ShowRegionPage({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })
  const initialCategoriesConfig = createInitialCategoriesConfig(region.categories)

  return (
    <MapInterface initialMapParam={region.map} initialCategoriesConfig={initialCategoriesConfig} />
  )
}
