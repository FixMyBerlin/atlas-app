import { Spinner } from '@/src/app/_components/Spinner/Spinner'
import { Tooltip } from '@/src/app/_components/Tooltip/Tooltip'
import { useMapDataLoading } from '../../_hooks/mapState/useMapState'

export const LoadingIndicator = () => {
  const mapDataLoading = useMapDataLoading()

  if (mapDataLoading === false) return null

  return (
    <div className="relative rounded-md bg-teal-700">
      <Tooltip text="Kartendaten werden geladen…" className="cursor-help p-2">
        <Spinner size="5" color="teal" />
      </Tooltip>
    </div>
  )
}
