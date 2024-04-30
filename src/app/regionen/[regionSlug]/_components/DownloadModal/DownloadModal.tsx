import { router } from 'next/client'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { IconModal } from 'src/app/_components/Modal/IconModal'
import { useRegion } from '../regionUtils/useRegion'
import { DownloadModalDownloadList } from './DownloadModalDownloadList'
import { DownloadModalUpdateDate } from './DownloadModalUpdateDate'
import { useHasPermissions } from 'src/app/_hooks/useHasPermissions'
import Cookies from 'js-cookie'
import { cookieName } from 'src/app/_components/layouts/Header/User/cookieName'
import { useRouter } from 'next/navigation'

const useCanDownload = (exportPublic) => {
  if (exportPublic) {
    return true
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useHasPermissions()
  }
}

export const DownloadModal: React.FC = () => {
  const region = useRegion()
  const router = useRouter()
  const bboxDefined = region?.bbox ? true : false

  const canDownload = useCanDownload(region.exportPublic)

  const handleLogin = () => {
    Cookies.set(cookieName, `${location.pathname}${location.search}`)
    void router.push('/api/auth/osm/login')
  }

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
            Alle Daten stehen als <strong>GeoJSON</strong> zum Download sowie als{' '}
            <strong>Vector Tiles</strong> zur Darstellung zur Verfügung.
          </p>
        ) : (
          <>
            <p className="pb-2.5 pt-5 text-sm">
              Die Daten stehen nur für Rechte-Inhaber zur Verfügung. <br />
              Bitte loggen Sie sich{' '}
              <a className="underline" href="#" onClick={handleLogin}>
                hier
              </a>{' '}
              ein.
            </p>
          </>
        )}

        <DownloadModalUpdateDate />

        {canDownload && bboxDefined && <DownloadModalDownloadList />}

        {canDownload && !bboxDefined && (
          <p className="mb-2.5 rounded bg-orange-100 p-2 text-sm">
            Hinweis: GeoJSON Export ist für diese Region {region.fullName} nicht eingerichtet.
          </p>
        )}
      </IconModal>
    </section>
  )
}
