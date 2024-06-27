import { getQueryClient, getQueryKey, useMutation } from '@blitzjs/rpc'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import dompurify from 'dompurify'
import { useState } from 'react'
import { ModalDialog } from 'src/app/_components/Modal/ModalDialog'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import updateNoteComment from 'src/notes/mutations/updateNoteComment'
import getNoteAndComments from 'src/notes/queries/getNoteAndComments'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'

type Props = { body: string; commentId: number }

export const EditNoteCommentForm = ({ body, commentId }: Props) => {
  const [updateNoteCommentMutation, { isLoading, error }] = useMutation(updateNoteComment)
  const [open, setOpen] = useState(false)
  const region = useStaticRegion()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const sanitize = (input: string) => (input ? dompurify.sanitize(input) : input)
    updateNoteCommentMutation(
      {
        regionSlug: region!.slug,
        commentId,
        body: sanitize(new FormData(event.currentTarget).get('body')!.toString()),
      },
      {
        onSuccess: (comment) => {
          const queryKey = getQueryKey(getNoteAndComments, { id: comment.noteId })
          getQueryClient().invalidateQueries(queryKey)
          setOpen(false)
        },
      },
    )
  }

  return (
    <>
      <button type="button" className="" onClick={() => setOpen(true)}>
        <PencilSquareIcon className="size-6" />
      </button>
      <ModalDialog
        title="Kommentar bearbeiten"
        icon="edit"
        buttonCloseName="Abbrechen"
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={handleSubmit}>
          <label>
            <span className="sr-only">Kommentar bearbeiten (Markdown)</span>
            <textarea
              name="body"
              className="my-3 block min-h-28 w-full rounded-md border-0 bg-gray-50 py-2 leading-tight text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600"
              placeholder="Kommentar"
              data-1p-ignore
              data-lpignore
              defaultValue={body}
            />
          </label>
          <div className="flex items-center gap-1 leading-tight">
            <button type="submit" className={buttonStylesOnYellow} disabled={isLoading}>
              Speichern
            </button>
            {isLoading && <SmallSpinner />}
          </div>
          {/* @ts-expect-errors TODO Research how the error message is provided by Blitz */}
          {error ? <p className="text-red-500">{error.message}</p> : null}
        </form>
      </ModalDialog>
    </>
  )
}
