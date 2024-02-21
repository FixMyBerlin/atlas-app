import React from 'react'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { mapillaryKeyUrl } from '../../Tools/osmUrls/osmUrls'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'

export const tableKeyWebsite = 'website'
export const TagsTableRowWebsite: React.FC<CompositTableRow> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  const url = mapillaryKeyUrl(properties['osm_mapillary'])
  if (!url) return null

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <LinkExternal blank href={url}>
          {url.replace('https://', '').replace('http://', '')}
        </LinkExternal>
      }
    />
  )
}
