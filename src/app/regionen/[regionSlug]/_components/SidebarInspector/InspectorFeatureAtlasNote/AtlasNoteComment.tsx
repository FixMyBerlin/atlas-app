import { useSession } from '@blitzjs/auth'
import dompurify from 'dompurify'
import { Markdown } from 'src/app/_components/text/Markdown'
import { proseClasses } from 'src/app/_components/text/prose'
import getNoteAndComments from 'src/notes/queries/getNoteAndComments'
import { twJoin } from 'tailwind-merge'
import { OsmUserLink } from '../OsmUserLink'
import { EditNoteCommentForm } from './EditNoteCommentForm'
import { localDateTime } from './utils/localDateTime'
import { wasUpdate } from './utils/wasUpdated'

type Props = {
  comment: NonNullable<Awaited<ReturnType<typeof getNoteAndComments>>['noteComments']>[number]
}

export const AtlasNoteComment = ({ comment }: Props) => {
  const { osmName } = useSession()
  const userHasPermssionOnRegion = comment.author.osmName === osmName

  return (
    <>
      <div className="relative flex items-center justify-between">
        <div className="text-black">
          <strong>
            <OsmUserLink
              firstName={comment.author?.firstName}
              lastName={comment.author?.lastName}
              osmName={comment.author.osmName}
              hasPermission={userHasPermssionOnRegion}
            />
          </strong>
          <br />
          geschrieben am {localDateTime(comment.createdAt)}
          {wasUpdate(comment) && <>, aktualisiert am {localDateTime(comment.updatedAt)}</>}:
        </div>
        <EditNoteCommentForm body={comment.body} commentId={comment.id} />
      </div>

      <Markdown
        markdown={dompurify.sanitize(comment.body)}
        className={twJoin(
          proseClasses,
          'prose-sm my-2 border-l-4 border-white pl-3 prose-a:underline hover:prose-a:text-teal-700 hover:prose-a:decoration-teal-700',
        )}
      />
    </>
  )
}
