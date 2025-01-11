import { Portal } from '@/src/app/_components/utils/usePopper/Portal'
import { usePopper } from '@/src/app/_components/utils/usePopper/usePopper'
import { useCategoriesConfig } from '@/src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { produce } from 'immer'
import { twJoin } from 'tailwind-merge'
import { MapDataSubcategoryConfig } from '../../../_hooks/useQueryState/useCategoriesConfig/type'
import { MapDataCategoryId } from '../../../_mapData/mapDataCategories/MapDataCategoryId'
import { createSubcatStyleKey } from '../../utils/sourceKeyUtils/sourceKeyUtilsAtlasGeo'
import { Legend } from '../Legend/Legend'

type Props = {
  categoryId: MapDataCategoryId
  subcatConfig: MapDataSubcategoryConfig
  disabled: boolean
}

export const StylesDropdown = ({ categoryId, subcatConfig, disabled }: Props) => {
  const { categoriesConfig, setCategoriesConfig } = useCategoriesConfig()

  const [trigger, container] = usePopper({
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  })

  type SelectActiveProps = { subcatId: string; styleId: string }
  const selectActive = ({ subcatId, styleId }: SelectActiveProps) => {
    const oldConfig = categoriesConfig
    const newConfig = produce(oldConfig, (draft) => {
      const subcat = draft
        ?.find((th) => th.id === categoryId)
        ?.subcategories.find((t) => t.id === subcatId)

      if (subcat) {
        const style = subcat.styles.find((s) => s.id === styleId)
        subcat.styles.forEach((s) => (s.active = false))
        style && (style.active = true)
      }
    })
    void setCategoriesConfig(newConfig)
  }

  if (!subcatConfig) return null

  const activeStyleConfig = subcatConfig.styles.find((s) => s.active)

  // invariant(activeStyleConfig && activeStyleConfig.ui === 'dropdown')

  return (
    <div>
      <Menu as="div" className="relative inline-block w-full text-left">
        {({ open }) => (
          <>
            <div>
              <MenuButton
                ref={trigger}
                disabled={disabled}
                // `w-*` has to be set fo the `truncate` to work
                className={twJoin(
                  'inline-flex w-[12.5rem] justify-between rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium shadow-sm',
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
              </MenuButton>
            </div>

            <Portal>
              <MenuItems
                ref={container}
                className="absolute left-0 z-40 mt-2 max-w-full origin-top-left rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none"
              >
                <div className="py-1">
                  {subcatConfig.styles.map((styleConfig) => {
                    if (!styleConfig) return null
                    const key = createSubcatStyleKey(subcatConfig.id, styleConfig.id)
                    return (
                      <MenuItem key={key}>
                        {({ focus }) => (
                          <button
                            type="button"
                            onClick={() =>
                              selectActive({
                                subcatId: subcatConfig.id,
                                styleId: styleConfig.id,
                              })
                            }
                            className={twJoin(
                              styleConfig.active ? 'bg-yellow-400 text-gray-900' : 'text-gray-700',
                              focus ? 'bg-yellow-50' : '',
                              'block w-full px-4 py-2 text-left text-sm',
                            )}
                          >
                            {styleConfig.name}
                          </button>
                        )}
                      </MenuItem>
                    )
                  })}
                </div>
              </MenuItems>
            </Portal>
          </>
        )}
      </Menu>

      <Legend subcategoryId={subcatConfig.id} styleConfig={activeStyleConfig} />
    </div>
  )
}
