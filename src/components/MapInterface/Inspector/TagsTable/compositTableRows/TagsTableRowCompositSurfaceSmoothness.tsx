import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'
import { CompositTableRow } from './types'

export const tableKeySurfaceSmoothness = 'composit_surface_smoothness'
export const TagsTableRowCompositSurfaceSmoothness: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!(properties['smoothness'] || properties['surface'])) return null

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
                <details>
                  <summary>
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'surface'}
                      tagValue={properties['surface']}
                    />
                  </summary>
                  Quelle:{' '}
                  <ConditionalFormattedValue
                    sourceId={sourceId}
                    tagKey={'surface_source'}
                    tagValue={properties['surface_source']}
                  />
                  <br />
                  Genauigkeit der Quelle: Hoch
                </details>
              </td>
            </tr>
            <tr className="border-t">
              <th className="text-left pr-2 font-medium py-1">Zustand</th>
              <td className="w-full py-1">
                <details>
                  <summary>
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'smoothness'}
                      tagValue={properties['smoothness']}
                    />
                  </summary>
                  <p className="leading-tight mt-1">
                    <em>Quelle:</em>{' '}
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'smoothness_source'}
                      tagValue={properties['smoothness_source']}
                    />
                  </p>
                  <p className="leading-tight mt-1">
                    <em>Genauigkeit der Quelle:</em>{' '}
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'confidence'}
                      tagValue={properties['smoothness_confidence']}
                    />
                  </p>
                </details>
              </td>
            </tr>
          </tbody>
        </table>
      }
    />
  )
}
