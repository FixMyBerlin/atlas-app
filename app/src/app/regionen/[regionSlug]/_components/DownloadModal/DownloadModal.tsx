import { useSession } from '@blitzjs/auth'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { IconModal } from 'src/app/_components/Modal/IconModal'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'
import { useStartUserLogin } from 'src/users/hooks/useStartUserLogin'
import { useRegion } from '../regionUtils/useRegion'
import { DownloadModalDownloadList } from './DownloadModalDownloadList'
import { DownloadModalUpdateDate } from './DownloadModalUpdateDate'

export const DownloadModal = () => {
  const region = useRegion()
  const bboxDefined = region?.bbox ? true : false

  const hasPermissions = useHasPermissions()
  const canDownload = region.exportPublic ? true : hasPermissions
  const isLoggedIn = Boolean(useSession()?.role)

  const handleLogin = useStartUserLogin()

  if (region.hideDownload === true) return null

  return (
    <section>
      <IconModal
        title="Daten des Radverkehrsatlas downloaden"
        titleIcon="download"
        triggerStyle="button"
        triggerIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
      >
        {canDownload ? (
          <p className="pb-2.5 pt-5 text-sm">
            Alle Daten stehen als <strong>FlatGeoBuf</strong> zum Download sowie als{' '}
            <strong>Vector Tiles</strong> zur Darstellung zur Verfügung.
          </p>
        ) : (
          <>
            <p className="pb-2.5 pt-5 text-sm">
              Die Daten stehen nur für Rechte-Inhaber zur Verfügung.
            </p>
            {isLoggedIn ? (
              <p className="pb-2.5 pt-5 text-sm">
                Bitte <Link href="/kontakt">kontaktieren Sie uns</Link> um Zugriff zur Region und
                zum Download zu erhalten.
              </p>
            ) : (
              <p className="pb-2.5 pt-5 text-sm">
                Bitte{' '}
                <button className={linkStyles} onClick={handleLogin}>
                  loggen Sie sich ein
                </button>
                .
              </p>
            )}
          </>
        )}

        <DownloadModalUpdateDate />

        {canDownload && bboxDefined && <DownloadModalDownloadList />}

        {canDownload && !bboxDefined && (
          <p className="mb-2.5 rounded bg-orange-100 p-2 text-sm">
            Hinweis: Der Export ist für diese Region {region.fullName} nicht eingerichtet.
          </p>
        )}
      </IconModal>
    </section>
  )
}
