'use client'

import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'

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
            <p className="mt-1 leading-tight">
              <em>Quelle:</em>{' '}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'maxspeed_source'}
                tagValue={properties['maxspeed_source']}
              />
            </p>
            <p className="mt-1 leading-tight">
              <em>Genauigkeit der Quelle:</em>{' '}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'confidence'}
                tagValue={properties['maxspeed_confidence']}
              />
            </p>
            <p className="mt-1 leading-tight">
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
                <p className="mt-1 leading-tight">
                  <em>Höchstgeschwindigkeit entgegend der OSM Linienrichtung:</em>{' '}
                  <ConditionalFormattedValue
                    sourceId={sourceId}
                    tagKey={'maxspeed:backward'}
                    tagValue={properties['maxspeed:backward']}
                  />
                </p>
              )}
              {properties['maxspeed:forward'] && (
                <p className="mt-1 leading-tight">
                  <em>Höchstgeschwindigkeit in OSM Linienrichtung:</em>{' '}
                  <ConditionalFormattedValue
                    sourceId={sourceId}
                    tagKey={'maxspeed:forward'}
                    tagValue={properties['maxspeed:forward']}
                  />
                </p>
              )}
              {properties['maxspeed:conditional'] && (
                <p className="mt-1 leading-tight">
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
