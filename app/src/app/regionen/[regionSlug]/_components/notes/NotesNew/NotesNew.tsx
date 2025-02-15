import { useSession } from '@blitzjs/auth'
import { NotesNewLoginNotice } from './NotesNewLoginNotice'
import { NotesNewModal } from './NotesNewModal'

type Props = { visible: boolean; title: string; children: React.ReactNode }

export const NotesNew = ({ visible, title, children }: Props) => {
  const session = useSession()
  const isAuthenticated = typeof session.osmToken === 'string'

  if (!visible) return null

  return (
    <NotesNewModal>
      {!isAuthenticated && <NotesNewLoginNotice />}
      {isAuthenticated && (
        <div>
          <h1 className="sr-only">{title}</h1>
          <div className="grid h-full sm:grid-cols-2">{children}</div>
        </div>
      )}
    </NotesNewModal>
  )
}
