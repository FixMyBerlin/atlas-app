import React from 'react'
import { MapDataCategory } from 'src/regions/data/map/types'
import { getSubcategoryData } from 'src/regions/data/map/utils/getMapDataUtils'
import { twJoin } from 'tailwind-merge'
import { CategoryConfig } from '../../mapStateConfig/type'
import { SelectStyles } from '../SelectStyles/SelectStyles'

type Props = {
  categoryData: MapDataCategory
  categoryConfig: CategoryConfig
  disabled: boolean
}

export const SelectSubcategory: React.FC<Props> = ({ categoryData, categoryConfig, disabled }) => {
  if (!categoryData.subcategories || !categoryConfig.subcategories) return null

  return (
    <fieldset>
      <legend className="sr-only">Daten für das Thema {categoryData.name}</legend>
      <div>
        {categoryData.subcategories.map((subcategoryDataConfig) => {
          // What we get here as `subcategoryDataConfig` is the `id`+`defaultStyle`
          // object from src/app/regionen/[regionSlug]/_components/mapData/mapDataCategories/categories.const.ts
          // Therefore, we need to look up the full data:
          const subcatData = getSubcategoryData(subcategoryDataConfig.id)
          const subcatConfig = categoryConfig.subcategories.find(
            (t) => t.id === subcategoryDataConfig.id,
          )
          if (!subcatData || !subcatConfig) return null

          const showSubheadline = categoryData.subcategories.length > 1

          return (
            <div
              key={subcatData.id}
              className="mt-3 border-t border-gray-100 px-3 pt-2 first:mt-0 first:border-t-0"
            >
              <span
                className={twJoin(
                  'text-sm font-semibold leading-[17px] text-gray-900',
                  showSubheadline ? '' : 'sr-only',
                )}
              >
                {subcatData.name}
              </span>

              <SelectStyles
                categoryId={categoryConfig.id}
                subcatData={subcatData}
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
