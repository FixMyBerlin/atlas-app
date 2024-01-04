import { twJoin } from 'tailwind-merge'
import { StaticMapDataCategory } from '../../../_mapData/types'
import { MapDataCategoryConfig } from '../../../_hooks/useQueryState/useCategoriesConfig/type'
import { SelectStyles } from '../SelectStyles/SelectStyles'

type Props = {
  categoryConfig: MapDataCategoryConfig
  disabled: boolean
}

export const SelectSubcategory = ({ categoryConfig, disabled }: Props) => {
  if (!categoryConfig.subcategories) return null

  return (
    <fieldset>
      <legend className="sr-only">Daten für das Thema {categoryConfig.name}</legend>
      <div>
        {categoryConfig.subcategories.map((subcatConfig) => {
          if (!subcatConfig) return null

          const showSubheadline = categoryConfig.subcategories.length > 1

          return (
            <div
              key={subcatConfig.id}
              className="mt-3 border-t border-gray-100 px-3 pt-2 first:mt-0 first:border-t-0"
            >
              <span
                className={twJoin(
                  'text-sm font-semibold leading-[17px] text-gray-900',
                  showSubheadline ? '' : 'sr-only',
                )}
              >
                {subcatConfig.name}
              </span>

              <SelectStyles
                categoryId={categoryConfig.id}
                subcatConfig={subcatConfig}
                disabled={disabled}
              />
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
