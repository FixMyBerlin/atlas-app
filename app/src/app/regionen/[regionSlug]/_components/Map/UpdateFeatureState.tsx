import { useRef } from 'react'
import { MapGeoJSONFeature, useMap } from 'react-map-gl/maplibre'
import differenceBy from 'lodash/differenceBy'
import { useSelectedFeatures } from '../../_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'
import { useMapInspectorFeatures } from '../../_hooks/mapState/useMapState'

const key = (f: MapGeoJSONFeature) => `${f.id}:::${f.layer.id}`

export const UpdateFeatureState = () => {
  const { mainMap } = useMap()
  const previous = useRef<MapGeoJSONFeature[]>([])
  const inspectorFeatures = useMapInspectorFeatures()
  const selectedFeatures = useSelectedFeatures(!inspectorFeatures.length)

  // TODO: See https://github.com/FixMyBerlin/private-issues/issues/1775
  // eslint-disable-next-line react-compiler/react-compiler
  const previousSelectedFeatures = previous.current
  const currentSelectedFeatures = inspectorFeatures.length
    ? inspectorFeatures
    : selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  differenceBy(previousSelectedFeatures, currentSelectedFeatures, key).forEach((f) => {
    mainMap?.setFeatureState(f, { selected: false })
  })
  differenceBy(currentSelectedFeatures, previousSelectedFeatures, key).forEach((f) => {
    mainMap?.setFeatureState(f, { selected: true })
  })

  // TODO: See https://github.com/FixMyBerlin/private-issues/issues/1775
  // eslint-disable-next-line react-compiler/react-compiler
  previous.current = currentSelectedFeatures

  return null
}
