import React from 'react'
import { TagsTableRow } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'
import { CompositTableRow } from './types'

export const tableKeyLit = 'composit_lit'
export const TagsTableRowCompositLit: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!properties['lit']) return null

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <details>
          <summary>
            <ConditionalFormattedValue
              sourceId={sourceId}
              tagKey={'lit'}
              tagValue={properties['lit']}
            />
          </summary>
          {properties['osm_lit'] &&
            properties['osm_lit'] !== 'yes' &&
            properties['osm_lit'] !== 'no' && (
              <p className="mt-1 leading-tight">
                <em>Detaillierte Angaben direkt aus OSM:</em>{' '}
                <ConditionalFormattedValue
                  sourceId={sourceId}
                  tagKey={'osm_lit'}
                  tagValue={properties['osm_lit']}
                />
              </p>
            )}
          <p className="mt-1 leading-tight">
            <em>Aktualität:</em>{' '}
            <ConditionalFormattedValue
              sourceId={sourceId}
              tagKey={'fresh'}
              tagValue={properties['lit_fresh']}
            />
          </p>
        </details>
      }
    />
  )
}
