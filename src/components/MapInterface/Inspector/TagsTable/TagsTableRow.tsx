import { SourcesIds } from '@components/MapInterface/mapData'
import React from 'react'
import { ConditionalFormattedKey, ConditionalFormattedValue } from './translations'
import { DatasetIds } from '@components/MapInterface/mapData/sourcesMapData/datasets'

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
// type Props = {
//   sourceId: SourcesIds
//   tagKey: string
//   tagValue: string
// }

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
        {TagValueCell || ValueCell || (
          <span className="text-gray-200 group-hover:text-gray-400">Noch keine Daten</span>
        )}
      </td>
    </tr>
  )
}
