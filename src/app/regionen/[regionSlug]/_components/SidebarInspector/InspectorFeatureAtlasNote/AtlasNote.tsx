import dompurify from 'dompurify'
import Image from 'next/image'
import { Markdown } from 'src/app/_components/text/Markdown'
import { proseClasses } from 'src/app/_components/text/prose'
import { NoteAndComments } from 'src/notes/queries/getNoteAndComments'
import { twJoin } from 'tailwind-merge'
import { OsmUserLink } from '../OsmUserLink'
import SvgNotesClosed from '../icons/notes_closed.svg'
import SvgNotesOpen from '../icons/notes_open.svg'
import { EditNoteForm } from './EditNoteForm'
import { localDateTime } from './utils/localDateTime'
import { wasUpdated } from './utils/wasUpdated'
import { EditNoteResolvedAtForm } from './EditNoteResolvedAtForm'

type Props = {
  note: NoteAndComments
}

export const AtlasNote = ({ note }: Props) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="relative text-black">
          <strong>
            <OsmUserLink
              firstName={note.author?.firstName}
              lastName={note.author?.lastName}
              osmName={note.author.osmName}
            />
          </strong>
          <br />
          erstellt am {localDateTime(note.createdAt)}
          {wasUpdated(note) && <>, aktualisiert am {localDateTime(note.updatedAt)}</>}:
        </div>

        <EditNoteForm note={note} />
      </div>

      <div className="mt-3 border-l-4 border-white pl-3">
        <Markdown
          markdown={
            // Hinweis: Ein leerer body kommt nur bei importieren Notes vor, da der `body` ein Pflichtfeld in allen Formularen ist.
            note.body ? dompurify.sanitize(note.body) : `_Es wurde nur ein Betreff angegeben._`
          }
          className={twJoin(
            proseClasses,
            'prose-sm prose-a:underline hover:prose-a:text-teal-700 hover:prose-a:decoration-teal-700',
          )}
        />
      </div>

      <EditNoteResolvedAtForm note={note} />
    </>
  )
}
