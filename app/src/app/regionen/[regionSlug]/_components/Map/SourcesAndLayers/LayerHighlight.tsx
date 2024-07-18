import { memo } from 'react'
import { Layer, LayerProps } from 'react-map-gl/maplibre'
import {
  Store,
  useMapStateInteraction,
  useMapStoreLoaded,
} from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import {
  useSelectedFeatures,
  type SelectedFeature,
} from '../../../_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'
import { sources } from '../../../_mapData/mapDataSources/sources.const'
import { extractHighlightFeatureIds } from './utils/extractHighlightFeatureIds'
import { wrapFilterWithAll } from './utils/filterUtils/wrapFilterWithAll'

type ParentLayerProps = {
  sourceData: (typeof sources)[number]
} & LayerProps

type MemoProps = Pick<Store, 'inspectorFeatures' | 'calculatorAreasWithFeatures'> & {
  selectedFeatures: SelectedFeature[]
}

const LayerHighlightMemoized = memo(function LayerHighlightMemoized(
  props: ParentLayerProps & MemoProps,
) {
  const { inspectorFeatures, calculatorAreasWithFeatures, selectedFeatures, sourceData } = props

  const mapLoaded = useMapStoreLoaded()

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

  if (layerProps.type === 'line') {
    if (!layerProps.paint) layerProps.paint = {}
    layerProps.paint['line-color'] = 'red'
    delete layerProps.paint['line-blur']
    delete layerProps.paint['line-opacity']
  } else if (layerProps.type === 'fill') {
    layerProps.paint = {
      ...layerProps.paint,
      'fill-color': 'red',
      'fill-opacity': 0.8,
    }
  } else if (layerProps.type === 'circle') {
    layerProps.paint = {
      ...layerProps.paint,
      'circle-color': 'red',
      'circle-stroke-color': 'black',
      'circle-stroke-width': 2,
    }
  } else if (layerProps.type === 'symbol') {
    layerProps.paint = {
      ...layerProps.paint,
      'text-halo-color': 'red',
      'text-halo-width': 3,
    }
  }

  // The component gets rendered regardless of visibility. Which means we flood react with filter
  // definitions which never get used. We have to re-evaluate if we should just remove the layer from the tree
  // unless used. But for now, lets only specify filters for visible layers.
  if (layerProps.layout?.visibility === 'visible') {
    // @ts-expect-error layerProps has also BackgroundLayer which does not have filter
    layerProps.filter =
      'filter' in layerProps && layerProps.filter
        ? wrapFilterWithAll([
            ['in', ['get', highlightingKey], ['literal', featureIds]],
            layerProps.filter,
          ])
        : ['in', ['get', highlightingKey], ['literal', featureIds]]
  }

  return <Layer {...layerProps} />
})

export const LayerHighlight = (parentLayerProps: ParentLayerProps) => {
  const { inspectorFeatures, calculatorAreasWithFeatures } = useMapStateInteraction()

  const selectedFeatures = useSelectedFeatures()

  const props = {
    ...parentLayerProps,
    inspectorFeatures,
    calculatorAreasWithFeatures,
    selectedFeatures,
  }

  return <LayerHighlightMemoized {...props} />
}
