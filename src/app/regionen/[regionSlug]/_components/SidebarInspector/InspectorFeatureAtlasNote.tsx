import { useQuery } from '@blitzjs/rpc'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { Suspense } from 'react'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { isDev } from 'src/app/_components/utils/isEnv'
import { ObjectDump } from 'src/app/admin/_components/ObjectDump'
import getNoteAndComments from 'src/notes/queries/getNoteAndComments'
import { NotesAndCommentsFeatureCollection } from 'src/notes/queries/getNotesAndCommentsForRegion'
import { Disclosure } from './Disclosure/Disclosure'
import { AtlasNote } from './InspectorFeatureAtlasNote/AtlasNote'
import { AtlasNoteComment } from './InspectorFeatureAtlasNote/AtlasNoteComment'
import { NewNoteCommentForm } from './InspectorFeatureAtlasNote/NewNoteCommentForm'
import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'

type Props = {
  noteId: NotesAndCommentsFeatureCollection['featureCollection']['features'][number]['properties']['id']
}

export const InspectorFeatureAtlasNoteWithQuery = ({ noteId }: Props) => {
  const [noteAndComments] = useQuery(getNoteAndComments, { id: noteId })

  // All users with permissions on the region may also read notes and commens
  const hasPermissions = useHasPermissions()
  if (!hasPermissions) {
    return null
  }

  return (
    <div className="mt-5 w-full rounded-2xl">
      <Disclosure
        title={
          <span className="inline-flex items-center gap-2 leading-tight">
            <LockClosedIcon className="size-5 flex-none" /> {noteAndComments.subject}
          </span>
        }
        objectId={String(noteAndComments.id)}
      >
        <section className="bg-blue-50 px-3 py-5">
          <AtlasNote note={noteAndComments} />

          <ul>
            {noteAndComments.noteComments?.map((comment) => {
              return (
                <li key={comment.id} className="border-b border-b-gray-200 pt-2">
                  <AtlasNoteComment comment={comment} />
                </li>
              )
            })}
            <li>
              <NewNoteCommentForm noteId={noteAndComments.id} />
            </li>
          </ul>
        </section>

        {isDev && <ObjectDump data={noteAndComments} />}
      </Disclosure>
    </div>
  )
}

export const InspectorFeatureAtlasNote = ({ noteId }: Props) => {
  return (
    <Suspense fallback={<Spinner className="my-3" size="5" />}>
      <InspectorFeatureAtlasNoteWithQuery noteId={noteId} />
    </Suspense>
  )
}
