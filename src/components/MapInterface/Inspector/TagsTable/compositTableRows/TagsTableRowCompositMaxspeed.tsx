import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'
import { CompositTableRow } from './types'

export const tableKeyMaxspeed = 'composit_maxspeed'
export const TagsTableRowCompositMaxspeed: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!properties['maxspeed']) return null

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <>
          <details>
            <summary>
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'maxspeed'}
                tagValue={properties['maxspeed']}
              />
            </summary>
            <p className="leading-tight mt-1">
              <em>Quelle:</em>{' '}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'maxspeed_source'}
                tagValue={properties['maxspeed_source']}
              />
            </p>
            <p className="leading-tight mt-1">
              <em>Genauigkeit der Quelle:</em>{' '}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'confidence'}
                tagValue={properties['maxspeed_confidence']}
              />
            </p>
            <p className="leading-tight mt-1">
              <em>Aktualität:</em>{' '}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'fresh'}
                tagValue={properties['maxspeed_fresh']}
              />
            </p>
          </details>

          {(properties['maxspeed:backward'] ||
            properties['maxspeed:forward'] ||
            properties['maxspeed:conditional']) && (
            <details>
              <summary>Weitere Angaben aus OpenStreetMap</summary>

              {properties['maxspeed:backward'] && (
                <p className="leading-tight mt-1">
                  <em>Höchstgeschwindigkeit entgegend der OSM Linienrichtung:</em>{' '}
                  <ConditionalFormattedValue
                    sourceId={sourceId}
                    tagKey={'maxspeed:backward'}
                    tagValue={properties['maxspeed:backward']}
                  />
                </p>
              )}
              {properties['maxspeed:forward'] && (
                <p className="leading-tight mt-1">
                  <em>Höchstgeschwindigkeit in OSM Linienrichtung:</em>{' '}
                  <ConditionalFormattedValue
                    sourceId={sourceId}
                    tagKey={'maxspeed:forward'}
                    tagValue={properties['maxspeed:forward']}
                  />
                </p>
              )}
              {properties['maxspeed:conditional'] && (
                <p className="leading-tight mt-1">
                  <em>Konditionale Angaben:</em>{' '}
                  <ConditionalFormattedValue
                    sourceId={sourceId}
                    tagKey={'maxspeed:conditional'}
                    tagValue={properties['maxspeed:conditional']}
                  />
                </p>
              )}
            </details>
          )}
        </>
      }
    />
  )
}