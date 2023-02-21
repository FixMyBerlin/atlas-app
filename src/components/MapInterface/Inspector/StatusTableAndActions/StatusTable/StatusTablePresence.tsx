import {
  BoltIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { GeoJSONFeature } from 'maplibre-gl'

type Props = {
  visible: boolean
  properties: GeoJSONFeature['properties']
}

export const StatusTablePresence: React.FC<Props> = ({
  visible,
  properties,
}) => {
  if (!visible) return null
  const { is_present } = properties

  return (
    <section>
      <h5 className="mb-2 font-semibold text-gray-600">Vollständigkeit</h5>

      {is_present === true && (
        <span
          className="flex gap-1"
          title="Die Haupt-Dimension dieses Datensatzes wurde erfasst."
        >
          <CheckCircleIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>Ja, Daten sind vorhanden</span>
        </span>
      )}

      {is_present === false && (
        <span
          className="flex gap-1"
          title="Es fehlen Angaben zur Haupt-Dimension dieses Datensatzes."
        >
          <BoltIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>Nein, Daten fehlen</span>
        </span>
      )}

      {is_present === undefined && (
        <div
          className="flex gap-1"
          title="Das System kann keine Angabe machen."
        >
          <QuestionMarkCircleIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span className="text-gray-400">(Keine Aussage möglich)</span>
        </div>
      )}
    </section>
  )
}
