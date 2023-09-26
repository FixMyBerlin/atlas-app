import { SmallSpinner } from 'src/core/components--TODO-MIGRATE/Spinner/Spinner'
import { getTilesUrl } from 'src/core/components--TODO-MIGRATE/utils'
import { useQuery } from '@tanstack/react-query'

export const DownloadModalUpdateDate: React.FC = () => {
  const osmDataDate = useQuery({
    queryKey: ['metadata'],
    queryFn: async () => {
      const response = await fetch(`${getTilesUrl()}/public.bikelanes.json`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  return (
    <p className="flex items-center gap-2 pb-5 text-sm">
      Letzte Aktualisierung:{' '}
      {!!osmDataDate.data?.description && (
        <span>
          {new Date(
            Date.parse(JSON.parse(osmDataDate.data?.description)?.osm_data_from),
          ).toLocaleDateString('de-DE')}
        </span>
      )}
      {!!osmDataDate.isLoading && <SmallSpinner />}
      {!!osmDataDate.error && <span className="text-orange-500">Fehler beim Laden des Datums</span>}
    </p>
  )
}
