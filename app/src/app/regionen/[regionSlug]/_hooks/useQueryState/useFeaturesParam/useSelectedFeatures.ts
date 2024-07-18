import { MapGeoJSONFeature, useMap } from 'react-map-gl/maplibre'
import {
  useMapStoreBounds,
  useMapStoreLoaded,
} from '../../mapStateInteraction/useMapStateInteraction'
import { UrlFeature } from '../types'
import { useFeaturesParam } from './useFeaturesParam'
import { memoize } from 'lodash'

type Result = {
  urlFeature: UrlFeature
  mapFeature: MapGeoJSONFeature | undefined
}

const emptyArray: Result[] = []

const memoized = memoize(
  (result) => result,
  (result) => JSON.stringify(result.map((f) => [f.urlFeature, !!f.mapFeature])),
)

export type SelectedFeature = ReturnType<typeof useSelectedFeatures>[number]

export const useSelectedFeatures = () => {
  const { mainMap: map } = useMap()
  const mapLoaded = useMapStoreLoaded()
  const mapBounds = useMapStoreBounds()
  const { featuresParam } = useFeaturesParam()

  if (!map || !mapLoaded || !mapBounds || !featuresParam) return emptyArray

  const renderedFeatures = map.queryRenderedFeatures()
  const result = featuresParam.map((urlFeature) => {
    const mapFeature = renderedFeatures.find((f) => f.properties.id === urlFeature.properties.id)
    return { urlFeature, mapFeature }
  })

  return memoized(result) as Result[]
}
