import { sourceDatasetIdUrl } from '@components/MapInterface/mapData/sourcesMapData/sourcesDatasets/utils/sourceDatasetIdUrl'
import { useMapStateInteraction } from '@components/MapInterface/mapStateInteraction'
import { LocationGenerics } from '@routes/routes'
import { useMatch } from '@tanstack/react-location'
import React from 'react'
import { Layer, Source } from 'react-map-gl'

export const SourcesLayerRegionalMask: React.FC = () => {
  const {
    data: { region },
  } = useMatch<LocationGenerics>()
  const { pmTilesProtocolReady } = useMapStateInteraction()
  const { id, url } = sourceDatasetIdUrl('atlas-regional-masks')
  const datasetTileId = `source:${id}--tiles--pmTiles-are-ready-${pmTilesProtocolReady}`

  if (!region || !pmTilesProtocolReady) return null

  return (
    <Source id="mask" key={datasetTileId} type="vector" url={url}>
      <Layer
        type="fill"
        source="mask"
        source-layer="default"
        paint={{
          'fill-color': '#27272a',
          'fill-opacity': 0.8,
        }}
        filter={['all', ['==', 'region', region.path], ['==', 'kind', 'buffer']]}
      />
      <Layer
        type="line"
        source="mask"
        source-layer="default"
        paint={{
          'line-color': '#f59e0b',
          'line-width': 5,
          'line-opacity': 0.6,
        }}
        filter={['all', ['==', 'region', region.path], ['==', 'kind', 'boundary']]}
      />
    </Source>
  )
}
