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
        <table className="w-full leading-4">
          <tbody>
            <tr>
              <th className="py-1 pr-2 text-left font-medium">Belag</th>
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
              <th className="py-1 pr-2 text-left font-medium">Zustand</th>
              <td className="w-full py-1">
                <details>
                  <summary>
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'smoothness'}
                      tagValue={properties['smoothness']}
                    />
                  </summary>
                  <p className="mt-1 leading-tight">
                    <em>Quelle:</em>{' '}
                    <ConditionalFormattedValue
                      sourceId={sourceId}
                      tagKey={'smoothness_source'}
                      tagValue={properties['smoothness_source']}
                    />
                  </p>
                  <p className="mt-1 leading-tight">
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
