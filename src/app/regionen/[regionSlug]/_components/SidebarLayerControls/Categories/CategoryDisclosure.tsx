import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { produce } from 'immer'
import { useCategoriesConfig } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useCategoriesConfig/useCategoriesConfig'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { MapDataCategoryConfig } from '../../../_hooks/useQueryState/useCategoriesConfig/type'
import { SubcategoriesCheckbox } from '../Subcategories/SubcategoriesCheckbox'
import { SubcategoriesDropdown } from '../Subcategories/SubcategoriesDropdown'
import { Toggle } from '../Toggle/Toggle'

type Props = { categoryConfig: MapDataCategoryConfig; active: boolean }

export const CategoryDisclosure = ({ categoryConfig: currCategoryConfig, active }: Props) => {
  const { resetInspector } = useMapStateInteraction()
  const { categoriesConfig, setCategoriesConfig } = useCategoriesConfig()

  const selectCategory = (categoryId: string) => {
    const newConfig = produce(categoriesConfig, (draft) => {
      const category = draft.find((th) => th.id === categoryId)
      if (category) {
        category.active = !category.active
      }
    })
    void setCategoriesConfig(newConfig)
    resetInspector()
  }

  const dropdownSubcategories = currCategoryConfig.subcategories?.filter(
    (subcat) => subcat.ui === 'dropdown',
  )
  const checkboxSubcategories = currCategoryConfig.subcategories?.filter(
    (subcat) => subcat.ui === 'checkbox',
  )

  return (
    <Disclosure key={currCategoryConfig.name}>
      {({ open }) => (
        <>
          <div className="mt-2 flex justify-between border-t border-t-gray-200 pt-2 first:mt-0 first:border-t-transparent">
            <Toggle active={active} handleChange={() => selectCategory(currCategoryConfig.id)}>
              <h2 className="font-semibold">{currCategoryConfig.name}</h2>
              <p className="mt-1 text-xs leading-3 text-gray-400">{currCategoryConfig.desc}</p>
            </Toggle>
            <Disclosure.Button className="flex flex-none items-center justify-center border-l border-gray-200 px-1 text-yellow-500 hover:bg-yellow-50">
              {open ? (
                <ChevronDownIcon className="h-7 w-7" />
              ) : (
                <ChevronLeftIcon className="h-7 w-7" />
              )}
            </Disclosure.Button>
          </div>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static as="nav" className="mb-2 mt-3">
              {Boolean(dropdownSubcategories.length) && (
                <SubcategoriesDropdown
                  categoryId={currCategoryConfig.id}
                  subcategories={dropdownSubcategories}
                  disabled={!active}
                />
              )}
              {Boolean(checkboxSubcategories.length) && (
                <>
                  {Boolean(dropdownSubcategories.length) && <hr className="mx-1.5 mb-2 mt-3 h-1" />}
                  <SubcategoriesCheckbox
                    categoryId={currCategoryConfig.id}
                    subcategories={checkboxSubcategories}
                    disabled={!active}
                  />
                </>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}