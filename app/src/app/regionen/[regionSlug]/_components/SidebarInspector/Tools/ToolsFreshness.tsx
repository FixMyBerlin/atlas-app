import { BoltIcon, CheckCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { quote } from 'src/app/_components/text/Quotes'
import { StoreFeaturesInspector } from '../../../_hooks/mapState/useMapState'
import { MapDataSourceFreshnessConfig } from '../../../_mapData/types'

type Props = {
  properties: StoreFeaturesInspector['inspectorFeatures'][number]['properties']
  freshConfig: MapDataSourceFreshnessConfig
}

const WrapperWithIcon: React.FC<{
  iconKey: 'CheckCircle' | 'QuestionMarkCircle' | 'Bolt'
  primaryKeyTranslation: string
  children: React.ReactNode
}> = ({ iconKey, primaryKeyTranslation, children }) => {
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
    <div className="flex gap-1 text-gray-400">
      {pickIcon()}
      <span>
        <strong className="font-semibold text-gray-600">
          Aktualität {quote(primaryKeyTranslation)}:
        </strong>{' '}
        {children}
      </span>
    </div>
  )
}

export const ToolsFreshness: React.FC<Props> = ({ properties, freshConfig }) => {
  const { primaryKeyTranslation, freshKey, dateKey } = freshConfig

  const dateCheckDate = new Date(properties[dateKey]).toLocaleDateString()
  const dateUpdate = new Date(properties['update_at']).toLocaleDateString()

  return (
    <section className="mt-3">
      {(() => {
        switch (properties[freshKey]) {
          case 'fresh_check_date': {
            return (
              <WrapperWithIcon iconKey="CheckCircle" primaryKeyTranslation={primaryKeyTranslation}>
                <strong className="font-semibold text-gray-600">Daten sind aktuell.</strong>
                <br /> Attribut <code className="text-[90%]">{dateKey}</code> wurde am{' '}
                {dateCheckDate} als geprüft markiert.
              </WrapperWithIcon>
            )
          }
          case 'outdated_check_date': {
            return (
              <WrapperWithIcon iconKey="Bolt" primaryKeyTranslation={primaryKeyTranslation}>
                <strong className="font-semibold text-gray-600">
                  Daten sind älter als 2 Jahre.
                </strong>
                <br /> Attribut <code className="text-[90%]">{dateKey}</code> wurde zuletzt am{' '}
                {dateCheckDate} als geprüft markiert. Objekt wurde am {dateUpdate} zuletzt generell
                bearbeitet.
              </WrapperWithIcon>
            )
          }
          case 'fresh_update_at': {
            return (
              <WrapperWithIcon iconKey="CheckCircle" primaryKeyTranslation={primaryKeyTranslation}>
                <strong className="font-semibold text-gray-600">
                  Daten sind vermutlich aktuell.
                </strong>
                <br /> Objekt wurde am {dateUpdate} generell bearbeitet.
              </WrapperWithIcon>
            )
          }
          case 'outdated_update_at': {
            return (
              <WrapperWithIcon iconKey="Bolt" primaryKeyTranslation={primaryKeyTranslation}>
                <strong className="font-semibold text-gray-600">
                  Daten sind älter als 2 Jahre.
                </strong>
                <br /> Objekt wurde am {dateUpdate} zuletzt generell bearbeitet.
              </WrapperWithIcon>
            )
          }
        }
      })()}
    </section>
  )
}
