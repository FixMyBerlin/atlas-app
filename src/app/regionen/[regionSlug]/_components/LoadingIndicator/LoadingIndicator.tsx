import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Tooltip } from 'src/app/_components/Tooltip/Tooltip'

export const LoadingIndicator = () => {
  const { mapDataLoading } = useMapStateInteraction()

  if (mapDataLoading === false) return null

  return (
    <div className="relative rounded-md border border-gray-300 bg-white shadow-md">
      <Tooltip text="Kartendaten werden geladen…" className="cursor-help p-2">
        <Spinner size="5" />
      </Tooltip>
    </div>
  )
}
