import { MapDataCategoryConfig } from '../../../_hooks/useQueryState/useCategoriesConfig/type'
import { StylesCheckbox } from '../Styles/StylesCheckbox'

type Props = {
  categoryId: MapDataCategoryConfig['id']
  subcategories: MapDataCategoryConfig['subcategories']
  disabled: boolean
}

export const SubcategoriesCheckbox = ({ categoryId, subcategories, disabled }: Props) => {
  if (!subcategories) return null

  return (
    <fieldset className="relative space-y-2 px-2">
      {subcategories.map((subcatConfig) => {
        return (
          <StylesCheckbox
            key={subcatConfig.id}
            categoryId={categoryId}
            subcatConfig={subcatConfig}
            disabled={disabled}
          />
        )
      })}
    </fieldset>
  )
}
