import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { useMapStoreDataLoading } from '../../_hooks/mapState/useMapState'
import { Tooltip } from 'src/app/_components/Tooltip/Tooltip'

export const LoadingIndicator = () => {
  const mapDataLoading = useMapStoreDataLoading()

  if (mapDataLoading === false) return null

  return (
    <div className="relative rounded-md bg-teal-700">
      <Tooltip text="Kartendaten werden geladen…" className="cursor-help p-2">
        <Spinner size="5" color="teal" />
      </Tooltip>
    </div>
  )
}
