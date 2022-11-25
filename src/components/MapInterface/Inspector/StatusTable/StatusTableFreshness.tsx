import {
  BoltIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { GeoJSONFeature } from 'maplibre-gl'

type Props = {
  properties: GeoJSONFeature['properties']
  freshnessDateKey: string | undefined
}

export const StatusTableFreshness: React.FC<Props> = ({
  properties,
  freshnessDateKey,
}) => {
  const { is_fresh, is_present } = properties
  const localCheckDate = freshnessDateKey && properties[freshnessDateKey]

  const Table = (
    <>
      {is_fresh === true && (
        <div className="flex gap-1" title="">
          <CheckCircleIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>
            Daten sind aktuell{' '}
            {localCheckDate && (
              <>(geprüft am {new Date(localCheckDate).toLocaleDateString()})</>
            )}
          </span>
        </div>
      )}
      {is_fresh === false && localCheckDate && (
        <div className="flex gap-1" title="">
          <BoltIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
          <span>
            Daten sind älter als 2 Jahre{' '}
            {localCheckDate && (
              <>
                (zuletzt geprüft am
                {new Date(localCheckDate).toLocaleDateString()}
              </>
            )}
          </span>
        </div>
      )}
      {is_fresh === undefined ||
        (is_fresh === false && !localCheckDate && (
          <div className="flex gap-1" title="">
            {is_present ? (
              <>
                <QuestionMarkCircleIcon
                  className="h-5 w-5 flex-none text-gray-600"
                  aria-hidden="true"
                />
                <span>Keine Angabe</span>
              </>
            ) : (
              <span className="text-gray-400">(Primärdaten fehlen)</span>
            )}
          </div>
        ))}
    </>
  )

  return (
    <section>
      <h5 className="mb-2 font-semibold text-gray-600">Aktualität</h5>
      {freshnessDateKey ? (
        Table
      ) : (
        <span className="text-gray-500">(Keine Aussage möglich)</span>
      )}
    </section>
  )
}
