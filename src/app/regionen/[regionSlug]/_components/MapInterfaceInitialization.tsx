'use client'

import { useQuery } from '@blitzjs/rpc'
import { useMemo, useState } from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { useMapParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import getRegion from 'src/regions/queries/getRegion'
import invariant from 'tiny-invariant'
import { createMapRegionConfig } from './mapStateConfig/createMapRegionConfig'
import { initializeMapRegionConfig } from './mapStateConfig/initializeMapRegionConfig'

export const MapInterfaceInitialization = ({ children }: { children: React.ReactNode }) => {
  const regionSlug = useRegionSlug()
  const [region] = useQuery(getRegion, { slug: regionSlug })

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

  return <>{children}</>
}
