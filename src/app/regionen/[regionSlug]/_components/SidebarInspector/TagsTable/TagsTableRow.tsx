import React from 'react'
import { NodataFallback } from './compositTableRows/NodataFallback'
import { ConditionalFormattedKey } from './translations/ConditionalFormattedKey'
import { ConditionalFormattedValue } from './translations/ConditionalFormattedValue'
import { DatasetIds } from 'src/regions/data/map/datasets/datasets/types'
import { SourcesIds } from 'src/regions/data/map/sources/categorySources.const'

export type TagsTableRowProps =
  | {
      sourceId: SourcesIds | DatasetIds
      tagKey: string
      tagValue: string
      value?: never
    }
  | {
      sourceId: SourcesIds | DatasetIds
      tagKey: string
      tagValue?: never
      value: React.ReactNode
    }

export const TagsTableRow: React.FC<TagsTableRowProps> = ({
  sourceId,
  tagKey,
  tagValue,
  value: ValueCell,
}) => {
  const TagValueCell = tagValue && (
    <ConditionalFormattedValue sourceId={sourceId} tagKey={tagKey} tagValue={tagValue} />
  )

  return (
    <tr className="group">
      <td className="w-2/5 py-2 pl-4 pr-3 text-sm font-medium text-gray-900">
        <ConditionalFormattedKey sourceId={sourceId} tagKey={tagKey} />
      </td>
      <td className="px-3 py-2 text-sm text-gray-500">
        {TagValueCell || ValueCell || <NodataFallback />}
      </td>
    </tr>
  )
}
