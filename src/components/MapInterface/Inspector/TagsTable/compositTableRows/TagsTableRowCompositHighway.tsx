import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRow, TagsTableRowProps } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'

type Props = Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  properties: GeoJSONFeature['properties']
}

export const TagsTableRowCompositHighway: React.FC<Props> = ({ sourceId, tagKey, properties }) => {
  if (!properties['highway'] && !properties['_parent_highway']) return null

  const precedenceHighway = properties['_parent_highway'] || properties['highway']

  return (
    <TagsTableRow
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <ConditionalFormattedValue
          sourceId={sourceId}
          tagKey={'highway'}
          tagValue={precedenceHighway}
        />
      }
    />
  )
}
