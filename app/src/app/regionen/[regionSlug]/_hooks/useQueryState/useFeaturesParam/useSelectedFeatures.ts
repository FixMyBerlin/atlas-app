import { MapGeoJSONFeature, useMap } from 'react-map-gl/maplibre'
import {
  Store,
  useMapStateInteraction,
  useMapStoreLoaded,
} from '../../mapStateInteraction/useMapStateInteraction'
import { UrlFeature } from '../types'
import { useFeaturesParam } from './useFeaturesParam'

type Result = {
  urlFeature: UrlFeature
  mapFeature: MapGeoJSONFeature | undefined
}

// State variables
let prevMapLoaded = false
let prevMapBounds: Store['mapBounds'] = null
let prevResult: Result[] = []

export type SelectedFeature = ReturnType<typeof useSelectedFeatures>[number]

export const useSelectedFeatures = () => {
  const { mainMap: map } = useMap()
  const { mapBounds } = useMapStateInteraction()
  const mapLoaded = useMapStoreLoaded()

  const { featuresParam } = useFeaturesParam()

  if (!map || !mapLoaded || !mapBounds || !featuresParam) return []
  if (mapLoaded === prevMapLoaded && mapBounds === prevMapBounds) return prevResult

  // code below only runs if map is loaded and map bounds has changed

  const renderedFeatures = map.queryRenderedFeatures()
  const result = featuresParam.map((urlFeature) => {
    const mapFeature = renderedFeatures.find((f) => f.properties.id === urlFeature.properties.id)
    return { urlFeature, mapFeature }
  })

  // TODO: Find a way to do this that does not break the Rules of React https://react.dev/reference/rules
  // eslint-disable-next-line react-compiler/react-compiler
  prevMapLoaded = mapLoaded
  prevMapBounds = mapBounds
  prevResult = result

  return result
}
