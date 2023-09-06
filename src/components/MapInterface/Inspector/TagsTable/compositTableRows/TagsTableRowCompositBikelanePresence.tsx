import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRow, TagsTableRowProps } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'

type Props = Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  properties: GeoJSONFeature['properties']
}

const TagsTableRowCompositBikelanePresenceValue = ({
  sourceId, // always tarmac_roads
  tagKey, // one of … 'bikelane_presence_left','bikelane_presence_self','bikelane_presence_right'
  tagValue,
}: Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  tagValue: string
}) => {
  if (['not_expected', 'data_no'].includes(tagValue)) {
    return <ConditionalFormattedValue sourceId={sourceId} tagKey={tagKey} tagValue={tagValue} />
  }
  // By overwriting the tagKey we access the `ALL-category=*` translations
  return <ConditionalFormattedValue sourceId={sourceId} tagKey={'category'} tagValue={tagValue} />
}

export const TagsTableRowCompositBikelanePresence: React.FC<Props> = ({
  sourceId, // always tarmac_roads
  tagKey, // 'composit_bikelane_presence' used to look the key translation
  properties,
}) => {
  // Only show when one of those keys is present
  if (
    !(
      properties['bikelane_presence_left'] ||
      properties['bikelane_presence_right'] ||
      properties['bikelane_presence_self']
    )
  ) {
    return null
  }

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <>
          <table className="leading-4 w-full">
            <tbody>
              <tr>
                <th className="text-left pr-2 font-medium py-1">Links</th>
                <td className="w-full py-1">
                  <TagsTableRowCompositBikelanePresenceValue
                    sourceId={sourceId}
                    tagKey={'bikelane_presence_left'}
                    tagValue={properties['bikelane_presence_left']}
                  />
                </td>
              </tr>
              <tr className="border-t">
                <th className="text-left pr-2 font-medium py-1">Fahrbahn</th>
                <td className="w-full py-1">
                  <TagsTableRowCompositBikelanePresenceValue
                    sourceId={sourceId}
                    tagKey={'bikelane_presence_self'}
                    tagValue={properties['bikelane_presence_self']}
                  />
                </td>
              </tr>
              <tr className="border-t">
                <th className="text-left pr-2 font-medium py-1">Rechts</th>
                <td className="w-full py-1">
                  <TagsTableRowCompositBikelanePresenceValue
                    sourceId={sourceId}
                    tagKey={'bikelane_presence_right'}
                    tagValue={properties['bikelane_presence_right']}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-1 text-gray-400 text-xs">Angaben in Linienrichtung (OSM).</p>
        </>
      }
    />
  )
}
