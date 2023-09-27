import { useParam } from '@blitzjs/next'
import { useQuery } from '@blitzjs/rpc'
import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { Suspense, useMemo, useState } from 'react'
import { MapInterface } from 'src/core/components/MapInterface'
import { ErrorRestartMap } from 'src/core/components/MapInterface/ErrorRestartMap/ErrorRestartMap'
import {
  createMapRegionConfig,
  initializeMapRegionConfig,
} from 'src/core/components/MapInterface/mapStateConfig'
import { Spinner } from 'src/core/components/Spinner/Spinner'
import { LayoutMap } from 'src/core/layouts/LayoutMap'
import { MetaTags } from 'src/core/layouts/MetaTags'
import { useConfigParam } from 'src/core/useQueryState/useConfigParam'
import { useMapParam } from 'src/core/useQueryState/useMapParam'
import { isDev } from 'src/core/utils'
import getPublicRegion from 'src/regions/queries/getPublicRegion'

export const Region = () => {
  const regionSlug = useParam('regionSlug', 'string')
  const [region] = useQuery(getPublicRegion, { slug: regionSlug! })

  // Initialize the Map. This will update stale configs.
  // BUT, only on hard reload; hot reloading is not in scope for this.
  // Some stale config options are removed, new options are added; state is preserved.
  // Also guard against empty default searchParams; set them if any is missing (or empty)
  const freshConfig = useMemo(() => {
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
    // `void` gets rid of the await warning
    void setMapParam(map)

    const initialConfig = initializeMapRegionConfig({
      freshConfig,
      urlConfig: configParam,
    })
    void setConfigParam(initialConfig)

    setInitializeAndReset(false)
  }

  return (
    <>
      <MetaTags noindex title={`Radverkehrsatlas (beta) ${region.name}`} />
      <Sentry.ErrorBoundary
        onError={() => setInitializeAndReset(true)}
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <div>
              <ErrorRestartMap />
              {isDev && (
                <div className="mt-5 rounded bg-pink-300 p-1">
                  Do a reload intead. Changing the config breaks live reloading.
                  <br />
                  But our usecase is page (re)load, so that is fine.
                  <br />
                  See <code>PageRegionMap.tsx</code> for more.
                </div>
              )}
            </div>
          </div>
        }
      >
        <MapInterface />
      </Sentry.ErrorBoundary>
    </>
  )
}

const ShowRegionPage = () => {
  return (
    <LayoutMap>
      <Suspense fallback={<Spinner page />}>
        <Region />
      </Suspense>
    </LayoutMap>
  )
}

ShowRegionPage.authenticate = false
export default ShowRegionPage
