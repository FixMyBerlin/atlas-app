import { getQueryClient, getQueryKey, useMutation } from '@blitzjs/rpc'
import dompurify from 'dompurify'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import createNoteComment from 'src/notes/mutations/createNoteComment'
import getNoteAndComments from 'src/notes/queries/getNoteAndComments'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'

type Props = { noteId: number }

export const NewNoteCommentForm = ({ noteId }: Props) => {
  const [createNoteCommentMutation, { isLoading, error }] = useMutation(createNoteComment)
  const region = useStaticRegion()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const sanitize = (input: string) => (input ? dompurify.sanitize(input) : input)
    createNoteCommentMutation(
      {
        regionSlug: region!.slug,
        noteId,
        body: sanitize(new FormData(event.currentTarget).get('body')!.toString()),
      },
      {
        onSuccess: () => {
          const queryKey = getQueryKey(getNoteAndComments, { id: noteId })
          getQueryClient().invalidateQueries(queryKey)
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <span className="sr-only">Kommentar (Markdown)</span>
        <textarea
          name="body"
          className="my-3 block min-h-28 w-full rounded-md border-0 bg-gray-50 py-2 leading-tight text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600"
          placeholder="Kommentar"
          data-1p-ignore
          data-lpignore
        />
      </label>
      <div className="flex items-center gap-1 leading-tight">
        <button type="submit" className={buttonStylesOnYellow} disabled={isLoading}>
          Kommentar eintragen
        </button>
        {isLoading && <SmallSpinner />}
      </div>
      {/* @ts-expect-errors TODO Research how the error message is provided by Blitz */}
      {error ? <p className="text-red-500">{error.message}</p> : null}
    </form>
  )
}
