import { Markdown } from '@/src/app/_components/text/Markdown'
import { proseClasses } from '@/src/app/_components/text/prose'
import type { NoteComment } from '@/src/notes/queries/getNoteAndComments'
import dompurify from 'dompurify'
import { twJoin } from 'tailwind-merge'
import { OsmUserLink } from '../OsmUserLink'
import { EditNoteCommentForm } from './EditNoteCommentForm'
import { localDateTime } from './utils/localDateTime'
import { wasUpdated } from './utils/wasUpdated'

type Props = {
  comment: NoteComment
}

export const AtlasNoteComment = ({ comment }: Props) => {
  return (
    <>
      <Markdown
        markdown={dompurify.sanitize(comment.body)}
        className={twJoin(
          proseClasses,
          'prose-sm border-l-4 border-white pl-3 prose-a:underline hover:prose-a:text-teal-700 hover:prose-a:decoration-teal-700',
        )}
      />

      <div className="relative mt-3 flex items-center justify-between">
        <div>
          <strong>
            <OsmUserLink
              firstName={comment.author?.firstName}
              lastName={comment.author?.lastName}
              osmName={comment.author.osmName}
              showMembership={false}
            />
          </strong>
          {wasUpdated(comment) ? <br /> : ', '}
          {localDateTime(comment.createdAt)}
          {wasUpdated(comment) && <>, aktualisiert {localDateTime(comment.updatedAt)}</>}
        </div>

        <EditNoteCommentForm comment={comment} />
      </div>
    </>
  )
}
