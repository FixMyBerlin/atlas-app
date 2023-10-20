import React from 'react'
import { TagsTableRow, TagsTableRowProps } from '../TagsTableRow'
import { CompositTableRow } from './types'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'

const CompositRoadBikelanesTableValue = ({
  sourceId, // always tarmac_roads
  tagKey, // one of … 'bikelane_left','bikelane_self','bikelane_right'
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

export const tableKeyRoadBikelanes = 'composit_road_bikelanes'
export const TagsTableRowCompositRoadBikelanes: React.FC<CompositTableRow> = ({
  sourceId, // always tarmac_roads
  tagKey, // 'composit_bikelane' used to look the key translation
  properties,
}) => {
  // Only show when one of those keys is present
  if (
    !(properties['bikelane_left'] || properties['bikelane_right'] || properties['bikelane_self'])
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
          <table className="w-full leading-4">
            <tbody>
              <tr>
                <th className="py-1 pr-2 text-left font-medium">Links</th>
                <td className="w-full py-1">
                  <CompositRoadBikelanesTableValue
                    sourceId={sourceId}
                    tagKey={'bikelane_left'}
                    tagValue={properties['bikelane_left']}
                  />
                </td>
              </tr>
              <tr className="border-t">
                <th className="py-1 pr-2 text-left font-medium">Fahrbahn</th>
                <td className="w-full py-1">
                  <CompositRoadBikelanesTableValue
                    sourceId={sourceId}
                    tagKey={'bikelane_self'}
                    tagValue={properties['bikelane_self']}
                  />
                  {properties['road_implicit_shared_lane'] && (
                    <div className="mt-2">
                      <ConditionalFormattedValue
                        sourceId={sourceId}
                        tagKey={'road_implicit_shared_lane'}
                        tagValue={properties['road_implicit_shared_lane']}
                      />
                    </div>
                  )}
                </td>
              </tr>
              <tr className="border-t">
                <th className="py-1 pr-2 text-left font-medium">Rechts</th>
                <td className="w-full py-1">
                  <CompositRoadBikelanesTableValue
                    sourceId={sourceId}
                    tagKey={'bikelane_right'}
                    tagValue={properties['bikelane_right']}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-1 text-xs text-gray-400">Angaben in Linienrichtung (OSM).</p>
        </>
      }
    />
  )
}
