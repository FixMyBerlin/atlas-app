import { memo } from 'react'
import { Layer, LayerProps } from 'react-map-gl/maplibre'
import {
  Store,
  useMapStateInteraction,
} from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import {
  useSelectedFeatures,
  type SelectedFeature,
} from '../../../_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'
import { sources } from '../../../_mapData/mapDataSources/sources.const'
import { extractHighlightFeatureIds } from './utils/extractHighlightFeatureIds'

type ParentLayerProps = {
  sourceData: (typeof sources)[number]
} & LayerProps

type MemoProps = Pick<Store, 'mapLoaded' | 'inspectorFeatures' | 'calculatorAreasWithFeatures'> & {
  selectedFeatures: SelectedFeature[]
}

const LayerHighlightMemoized = memo(function LayerHighlightMemoized(
  props: ParentLayerProps & MemoProps,
) {
  const {
    mapLoaded,
    inspectorFeatures,
    calculatorAreasWithFeatures,
    selectedFeatures,
    sourceData,
  } = props

  const features = inspectorFeatures.length
    ? inspectorFeatures
    : selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  if (!mapLoaded) return null

  let highlightingKey: string | undefined = undefined
  let featureIds: string[] | undefined = undefined

  if (sourceData.inspector.enabled) {
    highlightingKey = sourceData.inspector.highlightingKey
    // NOTE: We used to filter the features by layer.id to make sure we only highlight features from the correct layer.
    // But with selectedFeatures we don't have the layer.id anymore.
    // But we might run into issues here where a feature id is used in multiple layers.
    // Idea: We could filter on source to guard against this…
    featureIds = extractHighlightFeatureIds(features, highlightingKey)
  }
  if (sourceData.calculator.enabled) {
    highlightingKey = sourceData.calculator.highlightingKey
    featureIds = extractHighlightFeatureIds(
      calculatorAreasWithFeatures.map((e) => e.features).flat(),
      highlightingKey,
    )
  }

  if (!highlightingKey || !featureIds || featureIds.length === 0) return null

  const layerProps = {
    ...props,
    id: `${props.id}--highlight`,
    paint: structuredClone(props.paint),
  } as LayerProps

  if (layerProps.type === 'symbol') {
    layerProps.paint = {
      ...layerProps.paint,
      'text-halo-color': 'red',
      'text-halo-width': 3,
    }
  }

  // @ts-expect-error layerProps has also BackgroundLayer which does not have filter
  layerProps.filter = ['in', highlightingKey, ...featureIds]

  return <Layer {...layerProps} />
})

export const LayerHighlight = (parentLayerProps: ParentLayerProps) => {
  const { mapLoaded, inspectorFeatures, calculatorAreasWithFeatures } = useMapStateInteraction()

  const selectedFeatures = useSelectedFeatures()

  const props = {
    ...parentLayerProps,
    mapLoaded,
    inspectorFeatures,
    calculatorAreasWithFeatures,
    selectedFeatures,
  }

  return <LayerHighlightMemoized {...props} />
}
