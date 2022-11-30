import { SourcesIds } from '@components/MapInterface/mapData'
import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRowCompositSurfaceSmoothness } from './compositTableRows'
import { TagsTableRow } from './TagsTableRow'

type Props = {
  properties: GeoJSONFeature['properties']
  documentedKeys: string[] | undefined
  sourceId: SourcesIds
}

export const TagsTable: React.FC<Props> = ({
  properties,
  documentedKeys,
  sourceId,
}) => {
  const documentedProperties = Object.fromEntries(
    Object.entries(properties)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter(([key, _v]) => documentedKeys?.includes(key))
  )

  return (
    <table className="w-full">
      <thead className="sr-only bg-gray-50">
        <tr>
          <th
            scope="col"
            className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Schlüssel
          </th>
          <th
            scope="col"
            className="px-3 py-1.5 text-left text-sm font-semibold text-gray-900"
          >
            Wert
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {documentedKeys?.map((key) => {
          // `documentedKeys` are specified on the source.const object.
          let cleanedKey = key
          // Handle documentedKeys that should _only show if a value is present_
          if (key.includes('__if_present')) {
            cleanedKey = key.replace('__if_present', '')
            if (!documentedProperties[cleanedKey]) {
              return null
            }
          }

          // Handle _composit_ table rows and default case
          switch (key) {
            case 'composit_surface_smoothness': {
              return (
                <TagsTableRowCompositSurfaceSmoothness
                  sourceId={sourceId}
                  tagKey={key}
                  properties={properties}
                />
              )
            }
            default: {
              return (
                <TagsTableRow
                  key={key}
                  sourceId={sourceId}
                  tagKey={key}
                  tagValue={documentedProperties[key]}
                />
              )
            }
          }
        })}
      </tbody>
    </table>
  )
}
