import { useMap } from 'react-map-gl/maplibre'
import { useFeaturesParam } from './useFeaturesParam'
import { findFeature } from '../../../_components/SidebarInspector/util'
import { MapGeoJSONFeature } from 'react-map-gl'
import { Store, useMapStateInteraction } from '../../mapStateInteraction/useMapStateInteraction'
import { UrlFeature } from '../types'

type Result = {
  urlFeature: UrlFeature
  mapFeature: MapGeoJSONFeature | null
}

const emptyArray: Result[] = []
let prevMapLoaded = false
let prevMapBounds: Store['mapBounds'] = null
let prevResult = emptyArray

export const useSelectedFeatures = () => {
  const { mainMap: map } = useMap()
  const { mapLoaded, mapBounds } = useMapStateInteraction()
  const { featuresParam } = useFeaturesParam()

  if (!map || !mapLoaded || !mapBounds || !featuresParam) return emptyArray
  if (mapLoaded === prevMapLoaded && mapBounds === prevMapBounds) return prevResult

  // code below only runs if map is loaded and map bounds has changed

  const renderedFeatures = map.queryRenderedFeatures()
  const result = featuresParam.map((urlFeature) => {
    const mapFeature = findFeature(renderedFeatures, urlFeature.properties) || null
    return { urlFeature, mapFeature }
  })
  prevResult = result

  prevMapLoaded = mapLoaded
  prevMapBounds = mapBounds
  prevResult = result

  return result
}
