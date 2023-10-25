'use client'

import { useQuery } from '@blitzjs/rpc'
import { useMemo, useState } from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { useConfigParam } from 'src/app/regionen/_components/useQueryState/useConfigParam'
import { useMapParam } from 'src/app/regionen/_components/useQueryState/useMapParam'
import getPublicRegion from 'src/regions/queries/getPublicRegion'
import invariant from 'tiny-invariant'
import { MapInterface } from '../_components/MapInterface/MapInterface'
import { createMapRegionConfig } from '../_components/MapInterface/mapStateConfig/createMapRegionConfig'
import { initializeMapRegionConfig } from '../_components/MapInterface/mapStateConfig/initializeMapRegionConfig'

// export const metadata: Metadata = {
//   title: 'Radverkehrsatlas Region-Karte', // TODO MIGRATION ADD NAME
//   robots: 'noindex',
// }

export default function ShowRegionPage() {
  const regionSlug = useRegionSlug()
  const [region] = useQuery(getPublicRegion, { slug: regionSlug })

  // Initialize the Map. This will update stale configs.
  // BUT, only on hard reload; hot reloading is not in scope for this.
  // Some stale config options are removed, new options are added; state is preserved.
  // Also guard against empty default searchParams; set them if any is missing (or empty)
  const freshConfig = useMemo(() => {
    invariant(region.themes)
    return createMapRegionConfig(region.themes)
  }, [region.themes])

  const { mapParam, setMapParam } = useMapParam()
  const { configParam, setConfigParam } = useConfigParam()

  // This initializes the `map` and `config` and allows us reset the config on demand.
  // When we change stuff in our config, our URL config needs to change.
  // Otherwise things blow up, becaues we look for config entries that where removed.
  // We use the ErrorBoundary to setResetConfig(true) the following reset gets applied.
  // We re-use this reset to update the config on the first render.
  const [initializeAndReset, setInitializeAndReset] = useState(true)

  if (initializeAndReset === true) {
    // The order in which we initially call set*Param is the order we see in the URL.
    const map = mapParam || {
      zoom: Number(region?.map?.zoom ?? 12),
      lat: Number(region?.map?.lat ?? 52.507),
      lng: Number(region?.map?.lng ?? 13.367),
    }
    void setMapParam(map)

    const initialConfig = initializeMapRegionConfig({
      freshConfig,
      urlConfig: configParam,
    })
    void setConfigParam(initialConfig)

    setInitializeAndReset(false)
  }

  return <MapInterface />
}

ShowRegionPage.authenticate = false
