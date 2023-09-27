import { useEffect, useMemo, useState } from 'react'
import { LocationGenerics } from 'src/core/useQueryState/TODO-MIRGRATE-REMOVE/routes'
import { sourcesBackgroundsRaster } from 'src/core/components/MapInterface/mapData'
import {
  createMapRegionConfig,
  initializeMapRegionConfig,
} from 'src/core/components/MapInterface/mapStateConfig'

export const PageRegionMap: React.FC = () => {
  const { lat, lng, zoom, config } = useSearch<LocationGenerics>()
  const {
    data: { region },
    params: { regionPath },
  } = useMatch<LocationGenerics>()

  // Guard against false regionPath params which result in empty region-data
  if (!region) {
    return <Navigate to="/regionen" search={{ regionPathNotFound: regionPath }} replace />
  }

  // Initialize the Map. This will update stale configs.
  // BUT, only on hard reload; hot relaoding is not in scope for this.
  // Some stale config options are removed, new ones added; state is preserved.
  // Also guard against empty default searchParams; set them if any is missing (or empty)
  const navigate = useNavigate<LocationGenerics>()
  const freshConfig = useMemo(() => {
    return createMapRegionConfig(region.themes)
  }, [region.themes])

  // When we change stuff in our config, our URL config needs to change.
  // Otherwise things blow up, becaues we look for config entries that where removed.
  // We use the ErrorBoundary to setResetConfig(true) the following reset gets applied.
  // We re-use this reset to update the config on the first render.
  const [resetConfig, setResetConfig] = useState(true)
  useEffect(() => {
    if (!resetConfig && lat && lng && zoom && config) return

    const initialConfig = initializeMapRegionConfig({
      freshConfig,
      urlConfig: config,
    })

    navigate({
      search: (old) => {
        // Check if BG from URL (still) exist and use or fallback
        const bg =
          old?.bg && sourcesBackgroundsRaster.some((b) => b.id === old.bg) ? old.bg : 'default'

        return {
          ...old,
          lat: old?.lat ?? region.map.lat,
          lng: old?.lng ?? region.map.lng,
          zoom: old?.zoom ?? region.map.zoom,
          bg,
          config: initialConfig,
        }
      },
      replace: true,
    })
    setResetConfig(false)
  }, [resetConfig, lat, lng, zoom, config])

  return (
    // <LayoutMap>
    //   <Sentry.ErrorBoundary
    //     onError={() => setResetConfig(true)}
    //     fallback={
    //       <div className="flex h-full w-full items-center justify-center">
    //         <div>
    //           <ErrorRestartMap />
    //           {isDev && (
    //             <div className="mt-5 rounded bg-pink-300 p-1">
    //               Do a reload intead. Changing the config breaks live reloading.
    //               <br />
    //               But our usecase is page (re)load, so that is fine.
    //               <br />
    //               See <code>PageRegionMap.tsx</code> for more.
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     }
    //   >
    //     <MapInterface />
    //   </Sentry.ErrorBoundary>
    // </LayoutMap>
  )
}
