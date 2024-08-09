import { MapGeoJSONFeature, useMap } from 'react-map-gl/maplibre'
import { useMapBounds, useMapLoaded } from '../../mapState/useMapState'
import { UrlFeature } from '../types'
import { useFeaturesParam } from './useFeaturesParam'
import { memoize } from 'lodash'
import { isLayerHighlightId } from '../../../_components/Map/utils/layerHighlight'

type Result = {
  urlFeature: UrlFeature
  mapFeature: MapGeoJSONFeature | undefined
}

const emptyArray: Result[] = []

const memoized = memoize(
  (result) => result,
  (result) => JSON.stringify(result.map((f) => [f.urlFeature, !!f.mapFeature])),
)

export const useSelectedFeatures = () => {
  const { mainMap: map } = useMap()
  const mapLoaded = useMapLoaded()
  const mapBounds = useMapBounds()
  const { featuresParam } = useFeaturesParam()

  if (!map || !mapLoaded || !mapBounds || !featuresParam) return memoized(emptyArray) as Result[]

  const renderedFeatures = map.queryRenderedFeatures()
  const result = featuresParam.map((urlFeature) => {
    const mapFeature = renderedFeatures.find(
      (f) => f.id === urlFeature.id && !isLayerHighlightId(f.layer.id),
    )
    return { urlFeature, mapFeature }
  })

  return memoized(result) as Result[]
}
