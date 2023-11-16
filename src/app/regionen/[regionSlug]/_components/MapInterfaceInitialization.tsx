'use client'

import { useMemo, useState } from 'react'
import { useRegion } from 'src/app/(pages)/_components/regionUtils/useRegion'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { useMapParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useMapParam'
import invariant from 'tiny-invariant'
import { createMapRegionConfig } from './mapStateConfig/createMapRegionConfig'
import { initializeMapRegionConfig } from './mapStateConfig/initializeMapRegionConfig'

export const MapInterfaceInitialization = ({ children }: { children: React.ReactNode }) => {
  const region = useRegion()

  const { mapParam, setMapParam } = useMapParam()
  const { configParam, setConfigParam } = useConfigParam()

  // Initialize the Map and migrate old/stale config options.
  // DEV: Hot reload does not work with this and is out of scope. Reload if things go wrong.
  // Some stale config options are removed, new options are added; state is preserved.
  const freshConfig = useMemo(() => {
    invariant(region.themes)
    return createMapRegionConfig(region.themes)
  }, [region.themes])

  const [initialized, setInitialized] = useState(false)

  if (initialized === false) {
    // The order in which we initially call set*Param is the order we see in the URL.
    void setMapParam(mapParam || region.map)

    const initializedConfig = initializeMapRegionConfig({
      freshConfig,
      urlConfig: configParam,
    })
    void setConfigParam(initializedConfig)

    setInitialized(true)

    return <Spinner page />
  }

  return <>{children}</>
}
