import { getQueryClient, useMutation } from '@blitzjs/rpc'
import dompurify from 'dompurify'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import createNote from 'src/notes/mutations/createNote'
import { useNewAtlasNoteMapParam } from '../../../_hooks/useQueryState/useNotesAtlasParams'
import { useRegionSlug } from '../../regionUtils/useRegionSlug'
import { useQueryKey } from './utils/useQueryKey'

export const AtlasNotesNewForm = () => {
  const [createNoteMutation, { isLoading, error }] = useMutation(createNote)
  const { newAtlasNoteMapParam, setNewAtlasNoteMapParam } = useNewAtlasNoteMapParam()
  const regionSlug = useRegionSlug()
  const queryKey = useQueryKey()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!newAtlasNoteMapParam || !regionSlug) {
      return
    }

    const sanitize = (input: string | undefined) => (input ? dompurify.sanitize(input) : input)

    createNoteMutation(
      {
        regionSlug,
        subject: sanitize(new FormData(event.currentTarget).get('subject')!.toString())!,
        latitude: newAtlasNoteMapParam.lat,
        longitude: newAtlasNoteMapParam.lng,
        body: sanitize(new FormData(event.currentTarget).get('body')?.toString()) || undefined,
      },
      {
        onSuccess: () => {
          getQueryClient().invalidateQueries(queryKey)
          setNewAtlasNoteMapParam(null)
        },
      },
    )
  }

  return (
    <section className="">
      <div className="mt-4 flex justify-center">
        <h2 className="z-10 rounded-lg bg-teal-700 px-2 py-1 font-semibold leading-tight text-teal-50">
          2. Internen Hinweis verfassen
        </h2>
      </div>
      <form className="p-4" onSubmit={handleSubmit}>
        <p className="leading-snug">
          Interne Hinweise sind nur für angemeldete Nutzer:innen sichtbar, die für diese Region
          freigeschaltet wurden.
        </p>
        <label>
          <span className="sr-only">Betreff</span>
          <input
            type="text"
            name="subject"
            className="my-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600"
            placeholder="Betreff"
            data-1p-ignore
            data-lpignore
            required
          />
        </label>
        <label>
          <span className="sr-only">Hinweistext (Markdown)</span>
          <textarea
            name="body"
            className="my-3 block min-h-48 w-full rounded-md border-0 bg-gray-50 py-2 leading-tight text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600"
            placeholder="Hinweis"
            data-1p-ignore
            data-lpignore
            required
          />
        </label>
        <div className="flex items-center gap-1 leading-tight">
          <button type="submit" className={buttonStylesOnYellow} disabled={isLoading}>
            Internen Hinweis speichern
          </button>
          {isLoading && <SmallSpinner />}
        </div>
        {/* @ts-expect-errors TODO Research how the error message is provided by Blitz */}
        {error ? <p className="text-red-500">{error.message}</p> : null}
      </form>
    </section>
  )
}
