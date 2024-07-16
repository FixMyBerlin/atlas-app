import { InspectorFeatureProperty } from '../../Inspector'
import { TagsTableRowProps } from '../TagsTableRow'

export type CompositTableRow = Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  properties: InspectorFeatureProperty
}
