import { useSession } from '@blitzjs/auth'
import { getQueryClient, useMutation } from '@blitzjs/rpc'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import createNote from 'src/notes/mutations/createNote'
import { useQueryKey } from '../../notes/AtlasNotes/utils/useQueryKey'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { InspectorFeature } from '../Inspector'
import { pointFromGeometry } from '../Tools/osmUrls/pointFromGeometry'
import { Layer } from 'react-map-gl'

export const RegionBbPgNewPriorityNoteButton = ({ feature }: Pick<InspectorFeature, 'feature'>) => {
  const [createNoteMutation, { isLoading, error }] = useMutation(createNote)
  const regionSlug = useRegionSlug()
  const queryKey = useQueryKey()
  const session = useSession()
  const isAuthenticated = session.osmToken !== null

  if (regionSlug !== 'bb-pg') return null
  if (!isAuthenticated) return null
  if (!feature.layer.id.includes('bb-ramboll-umgelegte-linien')) return null

  const handleSubmit = async (importance: 'sehr wichtig' | 'wichtig' | 'weniger wichtig') => {
    const body = `
Wichtigkeit: ${importance}

Verbindungs-ID: ${feature.properties.Verbindung}

Von: ${feature.properties.from_name}

Nach: ${feature.properties.to_name}

ID: ${feature.properties.id}

[Deeplink](${window.document.location.href})
`

    const point = pointFromGeometry(feature.geometry)
    createNoteMutation(
      {
        regionSlug,
        subject: `Wichtigkeit: ${importance}`,
        latitude: point[1],
        longitude: point[0],
        body,
      },
      {
        onSuccess: () => {
          getQueryClient().invalidateQueries(queryKey)
        },
      },
    )
  }

  return (
    <section className="bg-teal-100 p-3">
      <div className="mt-4 flex justify-center">
        <h2 className="z-10 rounded-lg bg-teal-700 px-2 py-1 font-semibold leading-tight text-teal-50">
          Einen Prioritäten-Hinweis hinterlassen
        </h2>
      </div>
      <form className="p-4">
        <p className="mb-3 leading-snug">
          Diese speziellen interne Hinweise sind nur für angemeldete Nutzer:innen sichtbar, die für
          diese Region freigeschaltet wurden. Sie erzeugen automatisch einen Hinweis entlang der
          ausgewählten Strecke mit vorausgefüllter Beschreibung.
        </p>
        <div className="flex items-center gap-1 leading-tight">
          <button
            type="button"
            onClick={() => handleSubmit('sehr wichtig')}
            className={buttonStylesOnYellow}
            disabled={isLoading}
          >
            Sehr wichtig
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('wichtig')}
            className={buttonStylesOnYellow}
            disabled={isLoading}
          >
            Wichtig
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('weniger wichtig')}
            className={buttonStylesOnYellow}
            disabled={isLoading}
          >
            Weniger wichtig
          </button>
          {isLoading && <SmallSpinner />}
        </div>
        {/* @ts-expect-errors TODO Research how the error message is provided by Blitz */}
        {error ? <p className="text-red-500">{error.message}</p> : null}
      </form>
    </section>
  )
}
