import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { produce } from 'immer'
import React from 'react'
import { Portal } from 'src/app/_components/utils/usePopper/Portal'
import { usePopper } from 'src/app/_components/utils/usePopper/usePopper'
import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { twJoin } from 'tailwind-merge'
import { MapDataCategoryId } from '../../../_mapData/mapDataCategories/categories.const'
import { MapDataSubcategoryConfig } from '../../../_hooks/useQueryState/useCategoriesConfig/type'
import { createSubcatStyleKey } from '../../utils/createKeyUtils/createKeyUtils'
import { SelectLegend } from '../SelectLegend/SelectLegend'

type Props = {
  categoryId: MapDataCategoryId
  subcatConfig: MapDataSubcategoryConfig
  disabled: boolean
}

export const SelectStyles = ({ categoryId, subcatConfig, disabled }: Props) => {
  const { categoriesConfig, setCategoriesConfig } = useCategoriesConfig()

  const [trigger, container] = usePopper({
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  })

  type ToggleActiveProps = { subcatId: string; styleId: string }
  const toggleActive = ({ subcatId, styleId }: ToggleActiveProps) => {
    const oldConfig = categoriesConfig
    const newConfig = produce(oldConfig, (draft) => {
      const category = draft
        ?.find((th) => th.id === categoryId)
        ?.subcategories.find((t) => t.id === subcatId)

      if (category) {
        const style = category.styles.find((s) => s.id === styleId)
        category.styles.forEach((s) => (s.active = false))
        style && (style.active = !style.active)
      }
    })
    void setCategoriesConfig(newConfig)
  }

  if (!subcatConfig) return null

  const activeStyleConfig = subcatConfig.styles.find((s) => s.active)

  return (
    <section className="mt-1.5">
      <Menu as="div" className="relative inline-block w-full text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button
                ref={trigger}
                disabled={disabled}
                // `w-*` has to be set fo the `truncate` to work
                className={twJoin(
                  'inline-flex w-[12.5rem] justify-between rounded-md border border-gray-300  px-3 py-1.5 text-sm font-medium shadow-sm',
                  open ? 'shadow-md' : '',
                  disabled
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 focus:shadow-md focus:outline-none',
                )}
              >
                <div className="flex gap-1 truncate">
                  <span className="truncate">{activeStyleConfig?.name}</span>
                </div>
                <ChevronDownIcon className="-mr-1 ml-0.5 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Portal>
              <Menu.Items
                ref={container}
                className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none"
              >
                <div className="py-1">
                  {subcatConfig.styles.map((styleConfig) => {
                    if (!styleConfig) return null
                    const key = createSubcatStyleKey(subcatConfig.id, styleConfig.id)
                    return (
                      <Menu.Item key={key}>
                        {({ active }) => (
                          <button
                            type="button"
                            onClick={() =>
                              toggleActive({
                                subcatId: subcatConfig.id,
                                styleId: styleConfig.id,
                              })
                            }
                            className={twJoin(
                              styleConfig.active ? 'bg-yellow-400 text-gray-900' : 'text-gray-700',
                              active ? 'bg-yellow-50' : '',
                              'block w-full px-4 py-2 text-left text-sm',
                            )}
                          >
                            {styleConfig.name}
                          </button>
                        )}
                      </Menu.Item>
                    )
                  })}
                </div>
              </Menu.Items>
            </Portal>
          </>
        )}
      </Menu>

      <SelectLegend subcategoryId={subcatConfig.id} styleConfig={activeStyleConfig} />
    </section>
  )
}
