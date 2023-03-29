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
        <>
          {properties['surface'] && (
            <>
              {properties['smoothness'] && <>Belag: </>}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'surface'}
                tagValue={properties['surface']}
              />
            </>
          )}
          {properties['smoothness'] && (
            <>
              <br />
              Zustand:{' '}
              <ConditionalFormattedValue
                sourceId={sourceId}
                tagKey={'smoothness'}
                tagValue={properties['smoothness']}
              />
            </>
          )}
        </>
      }
    />
  )
}
