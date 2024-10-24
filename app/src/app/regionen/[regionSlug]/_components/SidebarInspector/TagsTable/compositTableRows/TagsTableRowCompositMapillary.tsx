import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { mapillaryKeyUrl } from '../../Tools/osmUrls/osmUrls'
import { TagsTableRow } from '../TagsTableRow'
import { CompositTableRow } from './types'

export const tableKeyMapillary = 'composit_mapillary'
export const TagsTableRowCompositMapillary = ({
  sourceId,
  tagKey,
  properties,
}: CompositTableRow) => {
  const url = mapillaryKeyUrl(properties['osm_mapillary'])
  if (!url) return null

  return (
    <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey}>
      <LinkExternal blank href={url}>
        In OSM hinterlegtes Straßenfoto anzeigen…
      </LinkExternal>
    </TagsTableRow>
  )
}
