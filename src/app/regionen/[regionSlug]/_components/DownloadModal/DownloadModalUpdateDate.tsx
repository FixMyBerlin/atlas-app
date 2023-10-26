import { useEffect, useState } from 'react'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { getTilesUrl } from 'src/app/_components/utils/getTilesUrl'

export const DownloadModalUpdateDate: React.FC = () => {
  const [osmDataDate, setOsmDataDate] = useState<null | any>(null)
  const [isLoading, setLoading] = useState(true)
  const [isError, setError] = useState(false)
  const apiUrl = `${getTilesUrl()}/public.bikelanes.json`

  useEffect(() => {
    void fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data?.description) {
          setOsmDataDate(JSON.parse(data.description))
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error(`DownloadModalUpdateDate: Error when fetching from ${apiUrl}`, error)
        setError(true)
      })
  }, [apiUrl])

  return (
    <p className="flex items-center gap-2 pb-5 text-sm">
      Letzte Aktualisierung:{' '}
      {osmDataDate && (
        <span>{new Date(Date.parse(osmDataDate?.osm_data_from)).toLocaleDateString('de-DE')}</span>
      )}
      {isLoading && <SmallSpinner />}
      {isError && <span className="text-orange-500">Fehler beim Laden des Datums</span>}
    </p>
  )
}
