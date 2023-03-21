import { BoltIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'

type Props = {
  visible: boolean
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
        return <CheckCircleIcon className="h-5 w-5 flex-none text-gray-600" aria-hidden="true" />
      case 'QuestionMarkCircle':
        return (
          <QuestionMarkCircleIcon className="h-5 w-5 flex-none text-gray-600" aria-hidden="true" />
        )
      case 'Bolt':
        return <BoltIcon className="h-5 w-5 flex-none text-gray-600" aria-hidden="true" />
    }
  }

  return (
    <div className="flex gap-1 text-gray-400" title="">
      {pickIcon()}
      <span>
        <strong className="font-semibold text-gray-600">Aktualität:</strong> {children}
      </span>
    </div>
  )
}

export const ToolsFreshness: React.FC<Props> = ({ visible, properties, freshnessDateKey }) => {
  if (!visible) return null
  const { fresh } = properties
  if (!freshnessDateKey) return null

  const dateCheckDate = new Date(properties[freshnessDateKey]).toLocaleDateString()

  const dateUpdate = new Date(properties['update_at']).toLocaleDateString()

  const Table = (() => {
    switch (fresh) {
      case 'fresh_check_date': {
        return (
          <StatusTableFreshnessCell iconKey="CheckCircle">
            <strong className="font-semibold text-gray-600">Daten sind aktuell.</strong>
            <br /> Attribut <code className="text-[90%]">{freshnessDateKey}</code> wurde am{' '}
            {dateCheckDate} als geprüft markiert.
          </StatusTableFreshnessCell>
        )
      }
      case 'outdated_check_date': {
        return (
          <StatusTableFreshnessCell iconKey="Bolt">
            <strong className="font-semibold text-gray-600">Daten sind älter als 2 Jahre.</strong>
            <br /> Attribut <code className="text-[90%]">{freshnessDateKey}</code> wurde zuletzt am{' '}
            {dateCheckDate} als geprüft markiert. Objekt wurde am {dateUpdate} zuletzt generell
            bearbeitet.
          </StatusTableFreshnessCell>
        )
      }
      case 'fresh_update_at': {
        return (
          <StatusTableFreshnessCell iconKey="CheckCircle">
            <strong className="font-semibold text-gray-600">Daten sind vermutlich aktuell.</strong>
            <br /> Objekt wurde am {dateUpdate} generell bearbeitet.
          </StatusTableFreshnessCell>
        )
      }
      case 'outdated_update_at': {
        return (
          <StatusTableFreshnessCell iconKey="Bolt">
            <strong className="font-semibold text-gray-600">Daten sind älter als 2 Jahre.</strong>
            <br /> Objekt wurde am {dateUpdate} zuletzt generell bearbeitet.
          </StatusTableFreshnessCell>
        )
      }
    }
  })()

  return (
    <section className="mt-3">
      <h5 className="sr-only">Aktualität</h5>
      {fresh ? Table : <span className="text-gray-500">(Keine Aussage möglich)</span>}
    </section>
  )
}
