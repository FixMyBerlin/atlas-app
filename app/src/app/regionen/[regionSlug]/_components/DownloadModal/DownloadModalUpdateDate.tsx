import { SmallSpinner } from '@/src/app/_components/Spinner/SmallSpinner'
import getAtlasGeoMetadata from '@/src/regions/queries/getAtlasGeoMetadata'
import { useQuery } from '@blitzjs/rpc'
import { Suspense } from 'react'

export const DownloadModalUpdateDate = () => {
  return (
    <p className="flex items-center gap-2 pb-5 text-sm">
      Letzte Aktualisierung der Daten:{' '}
      <Suspense fallback={<SmallSpinner />}>
        <DownloadModalUpdateDateDate />
      </Suspense>
    </p>
  )
}

const DownloadModalUpdateDateDate = () => {
  const [metadata] = useQuery(getAtlasGeoMetadata, {})

  if (!metadata?.osm_data_from) return null
  return (
    <>
      {new Date(metadata.osm_data_from).toLocaleDateString('de-DE')}{' '}
      <span className="text-gray-400">
        {new Date(metadata.osm_data_from).toLocaleTimeString('de-DE')}
      </span>
    </>
  )
}
