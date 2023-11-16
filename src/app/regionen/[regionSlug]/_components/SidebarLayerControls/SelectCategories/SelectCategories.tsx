import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { SelectCategory } from './SelectCategory'

export const SelectCategories = () => {
  const { configParam } = useConfigParam()
  console.log('## SelectCategories rendered', configParam)

  if (!configParam) return null

  const activeCategoryIds = configParam
    .filter((categoryConfig) => categoryConfig.active)
    .map((categoryConfig) => categoryConfig.id)

  return (
    <nav className="relative z-0 flex flex-col divide-x divide-gray-200">
      {configParam.map((categoryConfig) => {
        if (!categoryConfig) return null
        const active = activeCategoryIds.includes(categoryConfig.id)

        return (
          <SelectCategory key={categoryConfig.id} categoryConfig={categoryConfig} active={active} />
        )
      })}
    </nav>
  )
}
