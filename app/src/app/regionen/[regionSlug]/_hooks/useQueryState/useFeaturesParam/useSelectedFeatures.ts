import { memoize } from 'lodash'
import { useRef } from 'react'
import { MapGeoJSONFeature, useMap } from 'react-map-gl/maplibre'
import { isLayerHighlightId } from '../../../_components/Map/utils/layerHighlight'
import { useInteractiveLayers } from '../../../_components/Map/utils/useInteractiveLayers'
import { useMapBounds, useMapLoaded } from '../../mapState/useMapState'
import { UrlFeature } from '../types'
import { useFeaturesParam } from './useFeaturesParam'

type Result = {
  urlFeature: UrlFeature
  mapFeature: MapGeoJSONFeature | undefined
}

const emptyArray: Result[] = []

const memoized = memoize(
  (result) => result,
  (result) => JSON.stringify(result.map((f) => [f.urlFeature, !!f.mapFeature])),
)

// TODO: See https://github.com/FixMyBerlin/private-issues/issues/1775
/* eslint-disable react-compiler/react-compiler */
export const useSelectedFeatures = (run: Boolean) => {
  const featuresCache = useRef<{ [key: string | number]: MapGeoJSONFeature }>({}).current
  const { mainMap: map } = useMap()
  const mapLoaded = useMapLoaded()
  const mapBounds = useMapBounds()
  const { featuresParam } = useFeaturesParam()
  const interactiveLayers = useInteractiveLayers()

  if (!run || !map || !mapLoaded || !mapBounds || !featuresParam)
    return memoized(emptyArray) as Result[]

  const everyFeatureInCache = featuresParam.every((f) => f.id in featuresCache)
  const renderedFeatures: MapGeoJSONFeature[] = everyFeatureInCache
    ? []
    : map.queryRenderedFeatures({
        layers: interactiveLayers,
      })

  const result = featuresParam.map((urlFeature) => {
    let mapFeature =
      featuresCache[urlFeature.id] ||
      renderedFeatures.find((f) => f.id === urlFeature.id && !isLayerHighlightId(f.layer.id))
    if (mapFeature) {
      featuresCache[urlFeature.id] = mapFeature
    }
    return { urlFeature, mapFeature }
  })

  return memoized(result) as Result[]
}
