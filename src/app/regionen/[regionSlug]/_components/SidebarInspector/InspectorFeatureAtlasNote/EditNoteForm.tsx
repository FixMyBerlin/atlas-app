import { getQueryClient, getQueryKey, useMutation } from '@blitzjs/rpc'
import { Field, Label, Switch } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import dompurify from 'dompurify'
import Image from 'next/image'
import { useState } from 'react'
import { ModalDialog } from 'src/app/_components/Modal/ModalDialog'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStylesOnYellow } from 'src/app/_components/links/styles'
import updateNote from 'src/notes/mutations/updateNote'
import getNoteAndComments from 'src/notes/queries/getNoteAndComments'
import getNotesAndCommentsForRegion from 'src/notes/queries/getNotesAndCommentsForRegion'
import { twJoin } from 'tailwind-merge'
import { useStaticRegion } from '../../regionUtils/useStaticRegion'
import SvgNotesClosed from '../icons/notes_closed.svg'
import SvgNotesOpen from '../icons/notes_open.svg'

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

          <Field as="div" className="flex items-center">
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
                  <Image src={SvgNotesOpen} className="size-5" alt="" />
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
                  <Image src={SvgNotesClosed} className="size-5" alt="" />
                </span>
              </span>
            </Switch>
            <Label as="span" className="ml-3 text-sm">
              {formResolved ? 'ist erledigt' : 'ist offen'}
            </Label>
          </Field>

          <div className="mt-6 flex items-center gap-1 leading-tight">
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
