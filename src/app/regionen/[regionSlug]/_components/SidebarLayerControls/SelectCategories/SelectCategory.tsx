import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { produce } from 'immer'
import { useConfigParam } from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useConfigParam'
import { getCategoryData } from 'src/regions/data/map/utils/getMapDataUtils'
import { CategoryConfig } from '../../mapStateConfig/type'
import { useMapStateInteraction } from '../../mapStateInteraction/useMapStateInteraction'
import { SelectSubcategory } from '../SelectSubcategory/SelectSubcategory'
import { Toggle } from '../Toggle/Toggle'

type Props = { categoryConfig: CategoryConfig; active: boolean }

export const SelectCategory = ({ categoryConfig, active }: Props) => {
  const { resetInspector } = useMapStateInteraction()
  const categoryData = getCategoryData(categoryConfig.id)
  const { configParam, setConfigParam } = useConfigParam()

  const selectCategory = (categoryId: string) => {
    const newConfig = produce(configParam, (draft) => {
      const category = draft.find((th) => th.id === categoryId)
      if (category) {
        category.active = !category.active
      }
    })
    void setConfigParam(newConfig)
    resetInspector()
  }

  return (
    <Disclosure key={categoryData.name}>
      {({ open }) => (
        <>
          <div className="mt-2 flex justify-between border-t border-t-gray-200 pt-2 first:mt-0 first:border-t-transparent">
            <Toggle active={active} handleChange={() => selectCategory(categoryConfig.id)}>
              <h2 className="font-semibold">{categoryData.name}</h2>
              <p className="mt-1 text-xs leading-3 text-gray-400">{categoryData.desc}</p>
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
            <Disclosure.Panel static>
              <SelectSubcategory
                categoryData={categoryData}
                categoryConfig={categoryConfig}
                disabled={!active}
              />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
