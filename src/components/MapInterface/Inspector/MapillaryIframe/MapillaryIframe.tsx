import { SourcesIds } from '@components/MapInterface/mapData'
import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'

type Props = {
  properties: GeoJSONFeature['properties']
  sourceId: SourcesIds
}

// Docs https://www.mapillary.com/developer/api-documentation?locale=de_DE#embed
export const MapillaryIframe: React.FC<Props> = ({ properties, sourceId }) => {
  if (!sourceId.includes('mapillary')) return null

  return (
    <section>
      <iframe
        title="Mapillary Image Preview"
        src={`https://www.mapillary.com/embed?image_key=${properties.id}&style=photo`}
        className="-mb-2 aspect-square w-full"
      ></iframe>
    </section>
  )
}
