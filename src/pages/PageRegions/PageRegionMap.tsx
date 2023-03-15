import { LayoutMap } from '@components/Layout'
import { MapInterface } from '@components/MapInterface'
import { ErrorRestartMap } from '@components/MapInterface/ErrorRestartMap/ErrorRestartMap'
import {
  createMapRegionConfig,
  initializeMapRegionConfig,
} from '@components/MapInterface/mapStateConfig'
import { isDev } from '@components/utils'
import { LocationGenerics } from '@routes/routes'
import * as Sentry from '@sentry/react' // https://docs.sentry.io/platforms/javascript/guides/react/features/error-boundary/
import { Navigate, useMatch, useNavigate, useSearch } from '@tanstack/react-location'
import { useEffect, useMemo, useState } from 'react'

export const PageRegionMap: React.FC = () => {
  const { theme, lat, lng, zoom, config } = useSearch<LocationGenerics>()
  const {
    data: { region },
    params: { regionPath },
  } = useMatch<LocationGenerics>()

  // Guard aganst false regionPath params which result in empty region-data
  if (!region) {
    return <Navigate to="/regionen" search={{ regionPathNotFound: regionPath }} replace />
  }

  // Initialize the Map. This will update stale configs.
  // BUT, only on hard reload; hot relaoding is not in scope for this.
  // Some stale config options are removed, new ones added; state is preserved.
  // Also guard against empty default searchParams; set them if any is missing (or empty)
  const navigate = useNavigate<LocationGenerics>()
  const freshConfig = useMemo(() => {
    return createMapRegionConfig({ regionThemeIds: region.themes })
  }, [region.themes])
  const initialConfig = initializeMapRegionConfig({
    freshConfig,
    urlConfig: config,
  })

  // When we change stuff in our config, our URL config needs to change.
  // Otherwise things blow up, becaues we look for config entries that where removed.
  // We use the ErrorBoundary to setResetConfig(true) the following reset gets applied.
  // We re-use this reset to update the config on the first render.
  const [resetConfig, setResetConfig] = useState(true)
  useEffect(() => {
    // It might be, that a existing URL has a theme that we don't support anymore.
    const checkedTheme = theme && region.themes.includes(theme) ? theme : undefined

    if (!resetConfig && checkedTheme && lat && lng && zoom && config) return

    navigate({
      search: (old) => {
        return {
          lat: old?.lat ?? region.map.lat,
          lng: old?.lng ?? region.map.lng,
          zoom: old?.zoom ?? region.map.zoom,
          theme: checkedTheme ?? initialConfig?.[0]?.id ?? 'fromTo',
          bg: 'default',
          config: initialConfig,
          ...old,
        }
      },
      replace: true,
    })
    setResetConfig(false)
  }, [resetConfig, theme, lat, lng, zoom, config, initialConfig])

  return (
    <LayoutMap>
      <Sentry.ErrorBoundary
        onError={() => setResetConfig(true)}
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
    </LayoutMap>
  )
}
