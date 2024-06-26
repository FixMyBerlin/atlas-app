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

type Props = {
  note: NoteAndComments
}

export const AtlasNote = ({ note }: Props) => {
  return (
    <>
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

      <div className="border-l-4 border-white pl-3 ">
        <h2 className="my-3 font-semibold text-black">{note.subject}</h2>
        {note.body && (
          <Markdown
            markdown={dompurify.sanitize(note.body)}
            className={twJoin(
              proseClasses,
              'prose-sm my-2 prose-a:underline hover:prose-a:text-teal-700 hover:prose-a:decoration-teal-700',
            )}
          />
        )}
      </div>

      <div className="flex items-center justify-between py-3 pl-3">
        <p className="flex items-center gap-2">
          Status:{' '}
          {note.resolvedAt && (
            <span className="inline-flex gap-1" title={note.resolvedAt.toLocaleString()}>
              <Image src={SvgNotesClosed} className="size-5" alt="" />
              geschlossen
            </span>
          )}
          {!note.resolvedAt && (
            <span className="inline-flex gap-1">
              <Image src={SvgNotesOpen} className="size-5" alt="" />
              offen
            </span>
          )}
        </p>
        <EditNoteForm note={note} />
      </div>
    </>
  )
}
