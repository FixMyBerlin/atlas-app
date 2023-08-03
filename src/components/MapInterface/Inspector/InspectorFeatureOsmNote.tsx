import React from 'react'
import { IntlProvider } from 'react-intl'
import { extractDataIdIdFromDataKey } from '../Map/SourcesAndLayers/utils/extractFromSourceKey'
import { sourcesDatasets } from '../mapData/sourcesMapData'
import { DatasetIds } from '../mapData/sourcesMapData/datasets'
import { Disclosure } from './Disclosure'
import { InspectorFeature } from './Inspector'
import { translations } from './TagsTable/translations'

export const InspectorFeatureOsmNote: React.FC<InspectorFeature> = ({
  sourceKey,
  properties,
  geometry,
}) => {
  // if (!sourceKey || !properties) return null

  // The documentedKeys info is placed on the source object
  // const sourceId = extractDataIdIdFromDataKey(sourceKey) as DatasetIds
  // const sourceData = sourcesDatasets.find((dataset) => dataset.id == sourceId)

  // if (typeof sourceData === 'undefined') return null
  // if (!sourceData.inspector.enabled) return null

  return (
    <div className="mt-5 w-full rounded-2xl bg-white">
      <Disclosure title="OSM Notiz" objectId={properties?.id}>
        {properties?.date_created}
        {properties?.date_closed}
        {properties?.id && (
          <a
            href={`https://www.openstreetmap.org/note/${properties.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Auf OSM.org ansehen
          </a>
        )}
      </Disclosure>
    </div>
  )
}
