import { memo } from 'react'
import { Layer, LayerProps } from 'react-map-gl/maplibre'
import {
  Store,
  useMapStateInteraction,
} from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import {
  type SelectedFeature,
  useSelectedFeatures,
} from '../../../_hooks/useQueryState/useFeaturesParam/useSelectedFeatures'
import { sources } from '../../../_mapData/mapDataSources/sources.const'
import { extractHighlightFeatureIds } from './utils/extractHighlightFeatureIds'

type ParentLayerProps = {
  sourceData: (typeof sources)[number]
} & LayerProps

type MemoProps = Pick<Store, 'mapLoaded' | 'inspectorFeatures' | 'calculatorAreasWithFeatures'> & {
  selectedFeatures: SelectedFeature[]
}

const LayerHighlightMemoized: React.FC = memo(function LayerHighlightMemoized(
  props: ParentLayerProps & MemoProps,
) {
  const { mapLoaded, inspectorFeatures, calculatorAreasWithFeatures, selectedFeatures } = props

  const { sourceData } = props

  const features = inspectorFeatures.length
    ? inspectorFeatures
    : selectedFeatures.map((f) => f.mapFeature).filter(Boolean)

  if (!mapLoaded) return null

  let highlightingKey: string | undefined = undefined
  let featureIds: string[] | undefined = undefined

  if (sourceData.inspector.enabled) {
    highlightingKey = sourceData.inspector.highlightingKey
    featureIds = extractHighlightFeatureIds(
      features.filter((f) => f.layer.id === props.id),
      highlightingKey,
    )
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
  }

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

  if ('filter' in layerProps) {
    layerProps.filter = ['in', highlightingKey, ...featureIds]
  }

  return <Layer {...(layerProps as LayerProps)} />
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

  // @ts-ignore - let's keep it simple!
  return <LayerHighlightMemoized {...props} />
}
