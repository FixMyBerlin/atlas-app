import { useMap } from 'react-map-gl/maplibre'
import { useDataParam } from '../../../_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { SelectDatasets } from './SelectDatasets'

export const StaticDatasetCategories = () => {
  const { mainMap } = useMap()

  const regionDatasets = useRegionDatasets()
  const { dataParam, setDataParam } = useDataParam()

  const toggleAll = (value: string[]) => {
    void setDataParam(value)
  }

  if (!mainMap) return null
  if (!regionDatasets?.length) return null

  // The catgory can be null, which is our default Category.
  // The .category is also used as the named _for_now_ (in a cleaned up version).
  const groupedDatasets: { [category: string]: typeof regionDatasets } = {}
  regionDatasets.forEach((dataset) => {
    const category = (dataset.category as string) || 'Statische Daten'
    groupedDatasets[category] = [...(groupedDatasets[category] || []), dataset]
  })

  return (
    <nav className="relative z-0 flex flex-col divide-x divide-gray-200">
      {Object.entries(groupedDatasets).map(([category, datasets]) => {
        return <SelectDatasets key={category} category={category} datasets={datasets} />
      })}
    </nav>
  )
}
