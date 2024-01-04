import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { SelectCategory } from './SelectCategory'

export const SelectCategories = () => {
  const { categoriesConfig } = useCategoriesConfig()

  if (!categoriesConfig) return null

  const activeCategoryIds = categoriesConfig
    .filter((categoryConfig) => categoryConfig.active)
    .map((categoryConfig) => categoryConfig.id)

  return (
    <nav className="relative z-0 flex flex-col divide-x divide-gray-200">
      {categoriesConfig.map((categoryConfig) => {
        if (!categoryConfig) return null
        const active = activeCategoryIds.includes(categoryConfig.id)

        return (
          <SelectCategory key={categoryConfig.id} categoryConfig={categoryConfig} active={active} />
        )
      })}
    </nav>
  )
}
