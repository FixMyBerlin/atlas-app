import { GeoJSONFeature } from 'maplibre-gl'
import { TagsTableRowProps } from '../TagsTableRow'

export type CompositTableRow = Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  properties: GeoJSONFeature['properties']
}
