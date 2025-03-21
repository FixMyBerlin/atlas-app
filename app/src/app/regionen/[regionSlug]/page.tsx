import { invoke } from '@/src/blitz-server'
import { productName } from '@/src/data/tildaProductNames.const'
import getRegion from '@/src/server/regions/queries/getRegion'
import { DevMiddlewareHostnameWorkaround } from './_components/DevMiddlewareHostnameWorkaround'
import { MapInterface } from './_components/MapInterface'

export async function generateMetadata({ params }) {
  const region = await invoke(getRegion, { slug: params.regionSlug })

  return {
    robots: 'noindex',
    title: { absolute: `${region?.fullName} — ${productName.get(region.product)}` },
  }
}

// This page will always initialize with a `map` an `config` param, courtesy of ./middleware.ts
export default function RegionPage() {
  return (
    <>
      <DevMiddlewareHostnameWorkaround />
      <MapInterface />
    </>
  )
}
