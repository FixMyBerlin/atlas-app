import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import React from 'react'

type Props = {
  properties: { [key: string]: any }
  freshnessDateKey: string | undefined
}

export const StatusTable: React.FC<Props> = ({
  properties,
  freshnessDateKey,
}) => {
  return (
    <div className="border-t bg-gray-50 px-4 py-2.5 text-xs">
      <h4 className="mb-2 font-semibold">Bewertung der Datenqualität</h4>
      <div className="grid grid-cols-3">
        <div>
          <h5 className="font-semibold">Vollständigkeit</h5>
          {properties.is_present === true && (
            <span title="Die Haupt-Dimension dieses Datensatzes wurde erfasst.">
              <CheckBadgeIcon className="h-5 w-5" />
            </span>
          )}
          {properties.is_present === false && (
            <span title="Es fehlen Angaben zur Haupt-Dimension dieses Datensatzes.">
              TODO
            </span>
          )}
          {properties.is_present === undefined && (
            <span title="">Keine Angabe</span>
          )}
        </div>
        <div>
          <h5 className="font-semibold">Aktualität</h5>
          {properties.is_fresh === true && (
            <span title="">
              <CheckBadgeIcon className="h-5 w-5" />
              <br />
              {properties.fresh_age_days} Tage alt
              <br />
              {freshnessDateKey && properties[freshnessDateKey] && (
                <>
                  Prüfdatum:{' '}
                  {new Date(properties[freshnessDateKey]).toLocaleString(
                    'de-DE'
                  )}
                </>
              )}
            </span>
          )}
          {properties.is_fresh === false && <span title="">Nicht Aktuell</span>}
          {properties.is_fresh === undefined && (
            <span title="">Keine Angabe</span>
          )}
        </div>
        <div>
          <h5 className="font-semibold">Überprüfung (intern)</h5>
          {properties.verified === 'approfed' && (
            <span title="">
              <CheckBadgeIcon className="h-5 w-5" />
            </span>
          )}
          {properties.verified === 'rejected' && (
            <span title="">Überarbeitung nötig</span>
          )}
          {properties.verified === undefined && (
            <span title="">Keine Angabe</span>
          )}
        </div>
      </div>
    </div>
  )
}
