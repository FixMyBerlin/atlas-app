'use client'

import React from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { sourceDatasetIdUrl } from 'src/app/regionen/_components/MapInterface/mapData/sourcesMapData/sourcesDatasets/utils/sourceDatasetIdUrl'
import { useMapStateInteraction } from '../../mapStateInteraction/useMapStateInteraction'

export const SourcesLayerRegionalMask: React.FC = () => {
  const regionSlug = useRegionSlug()
  const { pmTilesProtocolReady } = useMapStateInteraction()
  const { id, url } = sourceDatasetIdUrl('atlas-regional-masks')
  const datasetTileId = `source:${id}--tiles--pmTiles-are-ready-${pmTilesProtocolReady}`

  if (!regionSlug || !pmTilesProtocolReady) return null

  return (
    <Source id="mask" key={datasetTileId} type="vector" url={url}>
      <Layer
        id="mask-buffer"
        type="fill"
        source="mask"
        source-layer="default"
        paint={{
          'fill-color': '#27272a',
          'fill-opacity': 0.8,
        }}
        filter={['all', ['==', 'region', regionSlug], ['==', 'kind', 'buffer']]}
      />
      <Layer
        id="mask-boundary"
        type="line"
        source="mask"
        source-layer="default"
        paint={{
          'line-color': '#f59e0b',
          'line-width': 5,
          'line-opacity': 0.6,
        }}
        filter={['all', ['==', 'region', regionSlug], ['==', 'kind', 'boundary']]}
      />
    </Source>
  )
}
