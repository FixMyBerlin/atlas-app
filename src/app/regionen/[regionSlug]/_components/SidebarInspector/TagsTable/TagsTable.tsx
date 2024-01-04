import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { DatasetIds } from '../../../_mapData/mapDataSources/datasets/types'
import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'
import { TagsTableRow } from './TagsTableRow'
import {
  TagsTableRowCompositHighway,
  tableKeyHighway,
} from './compositTableRows/TagsTableRowCompositHighway'
import { TagsTableRowCompositLit, tableKeyLit } from './compositTableRows/TagsTableRowCompositLit'
import {
  TagsTableRowCompositMaxspeed,
  tableKeyMaxspeed,
} from './compositTableRows/TagsTableRowCompositMaxspeed'
import {
  TagsTableRowCompositRoadBikelanes,
  tableKeyRoadBikelanes,
} from './compositTableRows/TagsTableRowCompositRoadBikelanes'
import {
  TagsTableRowCompositSurfaceSmoothness,
  tableKeySurfaceSmoothness,
} from './compositTableRows/TagsTableRowCompositSurfaceSmoothness'
import {
  TagsTableRowCompositTrafficSign,
  tableKeyTrafficSign,
} from './compositTableRows/TagsTableRowCompositTrafficSign'

type Props = {
  properties: GeoJSONFeature['properties']
  sourceDocumentedKeys: string[] | undefined | false
  sourceId: SourcesId | DatasetIds
}

export const TagsTable: React.FC<Props> = ({ properties, sourceDocumentedKeys, sourceId }) => {
  const cleanKey = (key: string) => key.replace('__if_present', '')

  const keys = sourceDocumentedKeys === false ? Object.keys(properties) : sourceDocumentedKeys

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
        {keys?.map((key) => {
          const cleanedKey = cleanKey(key)

          // Handle _composit_ table rows and default case
          switch (cleanedKey) {
            case tableKeyTrafficSign: {
              return (
                <TagsTableRowCompositTrafficSign
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyHighway: {
              return (
                <TagsTableRowCompositHighway
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeySurfaceSmoothness: {
              return (
                <TagsTableRowCompositSurfaceSmoothness
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyRoadBikelanes: {
              return (
                <TagsTableRowCompositRoadBikelanes
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyMaxspeed: {
              return (
                <TagsTableRowCompositMaxspeed
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyLit: {
              return (
                <TagsTableRowCompositLit
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            default: {
              // Hide all properties that should only be shown if a value is present.
              if (!properties[cleanedKey] && key.includes('__if_present')) {
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
