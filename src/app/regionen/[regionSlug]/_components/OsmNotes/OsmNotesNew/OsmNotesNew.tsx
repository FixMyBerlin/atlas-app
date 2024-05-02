import { useSession } from '@blitzjs/auth'
import { OsmNotesNewForm } from './OsmNotesNewForm'
import { OsmNotesNewLoginNotice } from './OsmNotesNewLoginNotice'
import { OsmNotesNewMap } from './OsmNotesNewMap'
import { OsmNotesNewModal } from './OsmNotesNewModal'
import { useNewOsmNoteMapParam } from '../../../_hooks/useQueryState/useOsmNotesParam'

export const OsmNotesNew = () => {
  const session = useSession()
  const isAuthenticated = session.osmToken !== null

  const { newOsmNoteMapParam } = useNewOsmNoteMapParam()
  if (!newOsmNoteMapParam) return null

  return (
    <OsmNotesNewModal>
      {!isAuthenticated && <OsmNotesNewLoginNotice />}
      {isAuthenticated && (
        <div>
          <h1 className="sr-only">Einen Hinweis auf OpenStreetMap veröffentlichen</h1>
          <div className="grid h-full sm:grid-cols-2">
            <OsmNotesNewMap />
            <OsmNotesNewForm />
          </div>
        </div>
      )}
    </OsmNotesNewModal>
  )
}
