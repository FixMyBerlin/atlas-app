import { getQueryClient, getQueryKey, useMutation } from '@blitzjs/rpc'
import { Label, Switch, SwitchGroup } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import dompurify from 'dompurify'
import { useState } from 'react'
import { ModalDialog } from 'src/app/_components/Modal/ModalDialog'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import updateNote from 'src/notes/mutations/updateNote'
import getNoteAndComments from 'src/notes/queries/getNoteAndComments'
import getNotesAndCommentsForRegion from 'src/notes/queries/getNotesAndCommentsForRegion'
import { twJoin } from 'tailwind-merge'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'

type Props = { subject: string; body: string | null; resolved: boolean; noteId: number }

export const EditNoteForm = ({ subject, body, resolved, noteId }: Props) => {
  const [updateNoteMutation, { isLoading, error }] = useMutation(updateNote)
  const [open, setOpen] = useState(false)
  const [formResolved, setFormResolved] = useState(resolved)
  const region = useStaticRegion()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const sanitize = (input: string) => (input ? dompurify.sanitize(input) : input)
    updateNoteMutation(
      {
        regionSlug: region!.slug,
        noteId,
        subject: sanitize(new FormData(event.currentTarget).get('subject')!.toString()),
        body: sanitize(new FormData(event.currentTarget).get('body')!.toString()),
        resolved: formResolved,
      },
      {
        onSuccess: (note) => {
          const queryKeyInspector = getQueryKey(getNoteAndComments, { id: note.id })
          getQueryClient().invalidateQueries(queryKeyInspector)
          const queryKeyMap = getQueryKey(getNotesAndCommentsForRegion)
          getQueryClient().invalidateQueries(queryKeyMap)
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
        title="Hinweis bearbeiten"
        icon="edit"
        buttonCloseName="Abbrechen"
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={handleSubmit}>
          <label>
            <span className="sr-only">Betreff bearbeiten</span>
            <input
              type="text"
              name="subject"
              className="my-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600"
              placeholder="Betreff"
              data-1p-ignore
              data-lpignore
              required
              defaultValue={subject}
            />
          </label>

          <label>
            <span className="sr-only">Kommentar bearbeiten (Markdown)</span>
            <textarea
              name="body"
              className="my-3 block min-h-28 w-full rounded-md border-0 bg-gray-50 py-2 leading-tight text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600"
              placeholder="Kommentar"
              data-1p-ignore
              data-lpignore
              required
              defaultValue={body || ''}
            />
          </label>

          <Switch
            checked={formResolved}
            onChange={setFormResolved}
            className={twJoin(
              formResolved ? 'bg-yellow-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2',
            )}
          >
            <span className="sr-only">Erledigt</span>
            <span
              className={twJoin(
                formResolved ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              )}
            >
              <span
                className={twJoin(
                  formResolved
                    ? 'opacity-0 duration-100 ease-out'
                    : 'opacity-100 duration-200 ease-in',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                )}
                aria-hidden="true"
              >
                <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={twJoin(
                  formResolved
                    ? 'opacity-100 duration-200 ease-in'
                    : 'opacity-0 duration-100 ease-out',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                )}
                aria-hidden="true"
              >
                <svg className="h-3 w-3 text-yellow-600" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>

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
