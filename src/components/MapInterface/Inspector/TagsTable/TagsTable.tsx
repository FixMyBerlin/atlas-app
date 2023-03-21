import { SourcesIds } from '@components/MapInterface/mapData'
import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRowCompositSurfaceSmoothness } from './compositTableRows'
import { TagsTableRowCompositTrafficSign } from './compositTableRows/TagsTableRowCompositTrafficSign'
import { TagsTableRow } from './TagsTableRow'

type Props = {
  properties: GeoJSONFeature['properties']
  sourceDocumentedKeys: string[] | undefined
  sourceId: SourcesIds
}

export const TagsTable: React.FC<Props> = ({ properties, sourceDocumentedKeys, sourceId }) => {
  const cleanKey = (key: string) => key.replace('__if_present', '')

  return (
    <table className="w-full">
      <thead className="sr-only">
        <tr>
          <th
            scope="col"
            className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Schlüssel
          </th>
          <th scope="col" className="px-3 py-1.5 text-left text-sm font-semibold text-gray-900">
            Wert
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {sourceDocumentedKeys?.map((key) => {
          const cleanedKey = cleanKey(key)

          // Handle _composit_ table rows and default case
          switch (cleanedKey) {
            case 'traffic_sign': {
              return (
                <TagsTableRowCompositTrafficSign
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case 'composit_surface_smoothness': {
              return (
                <TagsTableRowCompositSurfaceSmoothness
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            default: {
              // `sourceDocumentedKeys` are specified on the source.const object.
              // Handle sourceDocumentedKeys that should _only show if a value is present_
              if (!Object.keys(properties).includes(cleanedKey)) {
                return null
              }
              if (!properties[cleanedKey]) {
                return null
              }

              return (
                <TagsTableRow
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  tagValue={properties[cleanedKey]}
                />
              )
            }
          }
        })}
      </tbody>
    </table>
  )
}
