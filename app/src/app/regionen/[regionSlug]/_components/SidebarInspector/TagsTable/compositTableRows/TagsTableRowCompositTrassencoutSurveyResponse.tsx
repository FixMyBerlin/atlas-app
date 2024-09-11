import { Markdown } from 'src/app/_components/text/Markdown'
import { CompositTableRow } from './types'
import { Pill } from 'src/app/_components/text/Pill'

// Use by `app/scripts/StaticDatasets/geojson/region-bb/bb-trassenscout-beteiligung/meta.ts`
export const tableKeyTrassencoutSurveyResponse = 'composit_trassenscout_survey_response'
export const TagsTableRowCompositTrassencoutSurveyResponse = ({
  sourceId,
  tagKey,
  properties,
}: CompositTableRow) => {
  const color =
    properties.precision === 'point'
      ? '#7c3aed' // violet-600
      : '#c026d3' // fuscia-600
  const dimColor = properties.precision === 'point' ? '#ede9fe' : '#fae8ff'

  return (
    <tr className="group">
      <td
        className="space-y-3 border-l-2 py-2 pl-4 pr-3 text-sm font-medium text-gray-900"
        colSpan={2}
        style={{ borderColor: color }}
      >
        <div style={{ backgroundColor: dimColor }} className="-ml-4 -mr-3 -mt-2 px-4 py-3">
          {properties.precision === 'point'
            ? 'Dieser Hinweis ist an einer konkreten Stelle verortet'
            : 'Dieser Hinweis bezieht sich auf die gesamte Verbindung'}
        </div>
        <p>
          Verbindungs-Nummer: {properties.lineId}
          <br />
          Hinweis-Nummer: {properties.reponseId}
        </p>
        <p>
          <strong>{properties.Institut}</strong>, {properties.Landkreis || '–'}
          <br />
          <strong>{properties.Author}</strong> schrieb am{' '}
          {new Date(properties.sessionCreatedAt).toLocaleDateString()}
        </p>
        <p>
          <Pill color="gray">{properties.category}</Pill>
        </p>
        <hr />
        <Markdown markdown={properties.text} />
      </td>
    </tr>
  )
}
