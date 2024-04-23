import { useMap } from 'react-map-gl/maplibre'
import { useFeaturesParam } from './useFeaturesParam'
import { findFeature } from '../../../_components/SidebarInspector/util'
import { MapGeoJSONFeature } from 'react-map-gl'

const { entries, fromEntries } = Object

const store: { mapFeatures: Record<string, MapGeoJSONFeature> } = {
  mapFeatures: {},
}

export const useSelectedFeatures = () => {
  const { mainMap: map } = useMap()
  const { featuresParam, featuresParamWithKeys } = useFeaturesParam()
  if (!map || !featuresParam) return []

  entries(featuresParamWithKeys).forEach(([key, urlFeature]) => {
    if (!(key in store.mapFeatures)) {
      // (1) try getting feature from map
      const feature = findFeature(map.queryRenderedFeatures(), urlFeature.properties)
      if (feature) {
        store.mapFeatures[key] = feature
      }
    }
  })

  return entries(featuresParamWithKeys).map(([key, urlFeature]) => ({
    urlFeature,
    mapFeature: store.mapFeatures[key] || null,
  }))
}
