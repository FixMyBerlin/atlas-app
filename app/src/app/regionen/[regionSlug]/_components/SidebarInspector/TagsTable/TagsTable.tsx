import { SourcesId } from '../../../_mapData/mapDataSources/sources.const'
import { InspectorFeatureProperty } from '../Inspector'
import { TagsTableRow } from './TagsTableRow'
import {
  TagsTableRowColor,
  tableKeyColor,
  tableKeyColors,
} from './compositTableRows/TagsTableRowColor'
import {
  TagsTableRowCompositHighway,
  tableKeyHighway,
} from './compositTableRows/TagsTableRowCompositHighway'
import { TagsTableRowCompositLit, tableKeyLit } from './compositTableRows/TagsTableRowCompositLit'
import {
  TagsTableRowCompositMapillary,
  tableKeyMapillary,
} from './compositTableRows/TagsTableRowCompositMapillary'
import {
  TagsTableRowCompositMaxspeed,
  tableKeyMaxspeed,
} from './compositTableRows/TagsTableRowCompositMaxspeed'
import {
  TagsTableRowCompositRadinfraDeStatistics,
  tableKeyRadinfraDeStatistics,
} from './compositTableRows/TagsTableRowCompositRadinfraDeStatistics'
import {
  TagsTableRowCompositRoadBikelanes,
  tableKeyRoadBikelanes,
} from './compositTableRows/TagsTableRowCompositRoadBikelanes'
import {
  TagsTableRowCompositSurfaceSmoothness,
  tableKeySurfaceSmoothness,
} from './compositTableRows/TagsTableRowCompositSurfaceSmoothness'
import {
  TagsTableRowCompositTrafficSign,
  tableKeyTrafficSign,
} from './compositTableRows/TagsTableRowCompositTrafficSign'
import {
  TagsTableRowCompositTrassencoutSurveyResponse,
  tableKeyTrassencoutSurveyResponse,
} from './compositTableRows/TagsTableRowCompositTrassencoutSurveyResponse'
import { TagsTableRowWebsite, tableKeyWebsite } from './compositTableRows/TagsTableRowWebsite'
import { TagsTableRowWikipedia, tableKeyWikipedia } from './compositTableRows/TagsTableRowWikipedia'
import { cleanKey } from './utils/cleanKey'

type Props = {
  properties: InspectorFeatureProperty
  sourceDocumentedKeys: string[] | undefined | false
  sourceId: SourcesId | string // string = StaticDatasetsIds
}

export const TagsTable = ({ properties, sourceDocumentedKeys, sourceId }: Props) => {
  const keys = sourceDocumentedKeys === false ? Object.keys(properties) : sourceDocumentedKeys

  // Switch based on the sourceId
  if (sourceId === tableKeyRadinfraDeStatistics) {
    return <TagsTableRowCompositRadinfraDeStatistics properties={properties} />
  }

  return (
    <table className="w-full">
      <thead className="sr-only">
        <tr>
          <th
            scope="col"
            className="py-1.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Schlüssel
          </th>
          <th scope="col" className="px-3 py-1.5 text-left text-sm font-semibold text-gray-900">
            Wert
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {keys?.map((key) => {
          const cleanedKey = cleanKey(key)

          // Handle _composit_ table rows and default case
          switch (cleanedKey) {
            case tableKeyHighway: {
              return (
                <TagsTableRowCompositHighway
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeySurfaceSmoothness: {
              return (
                <TagsTableRowCompositSurfaceSmoothness
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyRoadBikelanes: {
              return (
                <TagsTableRowCompositRoadBikelanes
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyMaxspeed: {
              return (
                <TagsTableRowCompositMaxspeed
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyLit: {
              return (
                <TagsTableRowCompositLit
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyMapillary: {
              return (
                <TagsTableRowCompositMapillary
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyWebsite: {
              return (
                <TagsTableRowWebsite
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  properties={properties}
                />
              )
            }
            case tableKeyColor: {
              return (
                <TagsTableRowColor
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={key}
                  properties={properties}
                />
              )
            }
            case tableKeyColors: {
              return (
                <TagsTableRowColor
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={key}
                  properties={properties}
                />
              )
            }
            case tableKeyWikipedia: {
              return (
                <TagsTableRowWikipedia
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={key}
                  properties={properties}
                />
              )
            }
            case tableKeyTrafficSign: {
              return (
                <TagsTableRowCompositTrafficSign
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={key}
                  properties={properties}
                />
              )
            }
            case tableKeyTrassencoutSurveyResponse: {
              return (
                <TagsTableRowCompositTrassencoutSurveyResponse
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={key}
                  properties={properties}
                />
              )
            }
            default: {
              // Hide all properties that should only be shown if a value is present.
              if (!properties[cleanedKey] && key.includes('__if_present')) {
                return null
              }

              // // We cannot use the `case` here due to the key array
              // if (tableKeyTrafficSign.includes(cleanedKey)) {
              //   return (
              //     <TagsTableRowCompositTrafficSign
              //       key={cleanedKey}
              //       sourceId={sourceId}
              //       tagKey={cleanedKey}
              //       properties={properties}
              //     />
              //   )
              // }

              return (
                <TagsTableRow
                  key={cleanedKey}
                  sourceId={sourceId}
                  tagKey={cleanedKey}
                  tagValue={properties[cleanedKey]}
                />
              )
            }
          }
        })}
      </tbody>
    </table>
  )
}
