import { featureCollection } from '@turf/turf'
import { memo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import {
  StoreFeaturesInspector,
  useMapStateInteraction,
} from '../../../_hooks/mapStateInteraction/useMapStateInteraction'

type Props = Pick<StoreFeaturesInspector, 'inspectorFeatures'>

const SourcesLayerStaticDatasetsHighlightMemoized = memo(
  function SourcesLayerStaticDatasetsHighlightMemoized({ inspectorFeatures }: Props) {
    const groupedFeatures: Record<string, typeof inspectorFeatures> = {}
    inspectorFeatures?.forEach((f) => {
      const layerId = f.layer.id || 'boundary_country'
      if (!groupedFeatures[layerId]) groupedFeatures[layerId] = []
      groupedFeatures[layerId]!.push(f)
    })

    // TODO: Add … and abstract the condition into helper to reuse in <Inspector>
    // const isDataset = regionDatasets.some(
    //   (d) => d.id === extractSourceIdFromStaticDatasetSourceKey(sourceKey),
    // )

    return (
      <>
        {Object.entries(groupedFeatures).map(([groupKey, features]) => {
          return (
            <Source
              key={groupKey}
              id={`source--${groupKey}`}
              type="geojson"
              data={featureCollection(features || [])}
            >
              {/* <Layer
                id={`highlights--line--${groupKey}`}
                type="line"
                beforeId={groupKey}
                paint={{
                  'line-color': 'black',
                  'line-width': 10,
                }}
                filter={['==', '$type', 'LineString']}
              />
              <Layer
                id={`highlights--circle--${groupKey}`}
                type="circle"
                beforeId={groupKey}
                paint={{
                  'circle-radius': 10,
                  'circle-color': 'black',
                  'circle-stroke-color': 'black',
                  'circle-stroke-width': 2,
                }}
                filter={['==', '$type', 'Point']}
              />
              <Layer
                id={`highlights--fill--${groupKey}`}
                type="fill"
                beforeId={groupKey}
                paint={{
                  'fill-color': 'black',
                  'fill-opacity': 0.8,
                }}
                filter={['==', '$type', 'Polygon']}
              />
              <Layer
                id={`highlights--fill-line--${groupKey}`}
                type="line"
                beforeId={groupKey || 'boundary_country'}
                paint={{
                  'line-color': 'black',
                  'line-width': 10,
                }}
                filter={['==', '$type', 'Polygon']}
              /> */}
            </Source>
          )
        })}
      </>
    )
  },
)

export const SourcesLayerStaticDatasetsHighlight = () => {
  const { inspectorFeatures } = useMapStateInteraction()
  return <SourcesLayerStaticDatasetsHighlightMemoized {...{ inspectorFeatures }} />
}
