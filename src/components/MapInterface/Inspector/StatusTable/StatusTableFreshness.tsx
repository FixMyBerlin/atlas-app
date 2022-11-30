import {
  BoltIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'

type Props = {
  properties: GeoJSONFeature['properties']
  freshnessDateKey: string | undefined
}

const StatusTableFreshnessCell: React.FC<{
  iconKey: 'CheckCircle' | 'QuestionMarkCircle' | 'Bolt'
  children: React.ReactNode
}> = ({ iconKey, children }) => {
  const pickIcon = () => {
    switch (iconKey) {
      case 'CheckCircle':
        return (
          <CheckCircleIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
        )
      case 'QuestionMarkCircle':
        return (
          <QuestionMarkCircleIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
        )
      case 'Bolt':
        return (
          <BoltIcon
            className="h-5 w-5 flex-none text-gray-600"
            aria-hidden="true"
          />
        )
    }
  }

  return (
    <div className="flex gap-1" title="">
      {pickIcon()}
      <span>{children}</span>
    </div>
  )
}

export const StatusTableFreshness: React.FC<Props> = ({
  properties,
  freshnessDateKey,
}) => {
  const { fresh } = properties
  if (!freshnessDateKey) return null

  const dateCheckDate = new Date(
    properties[freshnessDateKey]
  ).toLocaleDateString()

  const dateUpdate = new Date(properties['update_at']).toLocaleDateString()

  const Table = (() => {
    switch (fresh) {
      case 'fresh_check_date': {
        return (
          <StatusTableFreshnessCell iconKey="CheckCircle">
            Daten sind aktuell{' '}
            <span className="text-gray-400">
              (als geprüft markiert am {dateCheckDate})
            </span>
          </StatusTableFreshnessCell>
        )
      }
      case 'outdated_check_date': {
        return (
          <StatusTableFreshnessCell iconKey="Bolt">
            Daten sind älter als 2 Jahre{' '}
            <span className="text-gray-400">
              (als geprüft markiert am{''}
              {dateCheckDate})
            </span>
          </StatusTableFreshnessCell>
        )
      }
      case 'fresh_update_at': {
        return (
          <StatusTableFreshnessCell iconKey="CheckCircle">
            Daten sind vermutlich aktuell{' '}
            <span className="text-gray-400">
              (Objekt generell bearbeitet am {dateUpdate})
            </span>
          </StatusTableFreshnessCell>
        )
      }
      case 'outdated_update_at': {
        return (
          <StatusTableFreshnessCell iconKey="Bolt">
            Daten sind älter als 2 Jahre{' '}
            <span className="text-gray-400">
              (Objekt generell bearbeitet am {dateUpdate})
            </span>
          </StatusTableFreshnessCell>
        )
      }
    }
  })()

  return (
    <section>
      <h5 className="mb-2 font-semibold text-gray-600">Aktualität</h5>
      {fresh ? (
        Table
      ) : (
        <span className="text-gray-500">(Keine Aussage möglich)</span>
      )}
    </section>
  )
}
