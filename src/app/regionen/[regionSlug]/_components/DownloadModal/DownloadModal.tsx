import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { IconModal } from 'src/app/_components/Modal/IconModal'
import { useRegion } from '../../../../(pages)/_components/regionUtils/useRegion'
import { DownloadModalDownloadList } from './DownloadModalDownloadList'
import { DownloadModalUpdateDate } from './DownloadModalUpdateDate'

export const DownloadModal: React.FC = () => {
  const region = useRegion()
  const allowDownload = region?.bbox ? true : false

  return (
    <section>
      <IconModal
        title="Daten des Radverkehrsatlas downloaden"
        titleIcon="download"
        triggerStyle="button"
        triggerIcon={<ArrowDownTrayIcon className="h-5 w-5" />}
      >
        <p className="pb-2.5 pt-5 text-sm">
          Alle Daten stehen als <strong>GeoJSON</strong> zum Download sowie als{' '}
          <strong>Vector Tiles</strong> zur Darstellung zur Verfügung.
        </p>

        <DownloadModalUpdateDate />

        {!allowDownload && (
          <p className="mb-2.5 rounded bg-orange-100 p-2 text-sm">
            Hinweis: GeoJSON Export ist für diese Region {region.fullName} nicht eingerichtet.
          </p>
        )}
        <DownloadModalDownloadList visible={allowDownload} />
      </IconModal>
    </section>
  )
}