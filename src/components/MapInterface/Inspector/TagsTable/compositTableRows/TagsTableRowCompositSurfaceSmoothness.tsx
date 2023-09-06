import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRow, TagsTableRowProps } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'

type Props = Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  properties: GeoJSONFeature['properties']
}

export const TagsTableRowCompositSurfaceSmoothness: React.FC<Props> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!properties['smoothness'] && !properties['surface']) return null

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <table className="leading-4 w-full">
          <tbody>
            <tr>
              <th className="text-left pr-2 font-medium py-1">Belag</th>
              <td className="w-full py-1">
                <ConditionalFormattedValue
                  sourceId={sourceId}
                  tagKey={'surface'}
                  tagValue={properties['surface']}
                />
              </td>
            </tr>
            <tr className="border-t">
              <th className="text-left pr-2 font-medium py-1">Zustand</th>
              <td className="w-full py-1">
                <ConditionalFormattedValue
                  sourceId={sourceId}
                  tagKey={'smoothness'}
                  tagValue={properties['smoothness']}
                />
              </td>
            </tr>
          </tbody>
        </table>
      }
    />
  )
}
