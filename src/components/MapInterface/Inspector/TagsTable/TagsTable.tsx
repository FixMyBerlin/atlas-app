import { SourcesIds } from '@components/MapInterface/mapData'
import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRow } from './TagsTableRow'
import { ConditionalFormattedValue } from './translations'

type Props = {
  properties: GeoJSONFeature['properties']
  documentedKeys: string[] | undefined
  sourceId: SourcesIds
}

export const TagsTable: React.FC<Props> = ({
  properties,
  documentedKeys,
  sourceId,
}) => {
  const documentedProperties = Object.fromEntries(
    Object.entries(properties)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .filter(([key, _v]) => documentedKeys?.includes(key))
  )

  return (
    <table className="w-full">
      <thead className="sr-only bg-gray-50">
        <tr>
          <th
            scope="col"
            className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Schlüssel
          </th>
          <th
            scope="col"
            className="px-3 py-1.5 text-left text-sm font-semibold text-gray-900"
          >
            Wert
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {documentedKeys?.map((key) => {
          const value = documentedProperties[key]

          // We have those special keys that we want to handle differently
          // We prefix them with an underscore (for now…)
          const isSpecial = key.startsWith('_')
          if (isSpecial) {
            switch (key) {
              case '_surfacequality': {
                return (
                  <TagsTableRow
                    key={key}
                    sourceId={sourceId}
                    tagKey={key}
                    value={
                      <>
                        <ConditionalFormattedValue
                          sourceId={sourceId}
                          tagKey={'smoothness'}
                          tagValue={properties['smoothness']}
                        />{' '}
                        —{' '}
                        <ConditionalFormattedValue
                          sourceId={sourceId}
                          tagKey={'surface'}
                          tagValue={properties['surface']}
                        />
                      </>
                    }
                  />
                )
              }
              default: {
                return (
                  <TagsTableRow
                    key={key}
                    sourceId={sourceId}
                    tagKey={key}
                    tagValue={value}
                  />
                )
              }
            }
          }
          return (
            <TagsTableRow
              key={key}
              sourceId={sourceId}
              tagKey={key}
              tagValue={value}
            />
          )
        })}
      </tbody>
    </table>
  )
}
