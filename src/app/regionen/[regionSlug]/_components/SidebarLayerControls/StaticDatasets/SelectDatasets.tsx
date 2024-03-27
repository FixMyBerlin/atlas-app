import { Disclosure, Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronLeftIcon } from '@heroicons/react/20/solid'
import { twJoin } from 'tailwind-merge'
import { useDataParam } from '../../../_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { createSourceKeyStaticDatasets } from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { SelectDataset } from './SelectDataset'
import { useState } from 'react'

export const SelectDatasets = ({
  category,
  datasets,
}: {
  category: string
  datasets: ReturnType<typeof useRegionDatasets>
}) => {
  const { dataParam, setDataParam } = useDataParam()
  const [allActive, setAllActive] = useState(false)

  const onChange = (value: string[]) => {
    void setDataParam(value)
  }
  const allDatasetKeysForThisCategory = datasets.map((d) =>
    createSourceKeyStaticDatasets(d.id, d.subId),
  )

  const activateAll = () => {
    const newDataParam = [...dataParam, ...allDatasetKeysForThisCategory]
    setDataParam(newDataParam)
    setAllActive(true)
  }

  const deactivateAll = () => {
    const newDataParam = dataParam.filter((param) => !allDatasetKeysForThisCategory.includes(param))
    setDataParam(newDataParam)
    setAllActive(false)
  }

  const categoryName = category.split('/').at(-1)
  const active = dataParam.some((param) => allDatasetKeysForThisCategory.includes(param))

  return (
    <Disclosure key={category}>
      {({ open }) => (
        <>
          <div className="mt-2 flex justify-between border-t border-t-gray-200 pt-2">
            <div
              className={twJoin(
                'ml-2 flex w-full flex-col items-start justify-center text-sm leading-[17px]',
                active ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900',
              )}
            >
              <h2 className="font-semibold">{categoryName}</h2>
              <p className="mt-1 text-xs leading-3 text-gray-400">
                {categoryName !== 'Statische Daten' && 'Statische Daten'}
              </p>
            </div>
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
            <Disclosure.Panel static as="nav" className="mb-2 mt-1">
              <div className="mt-1 text-right">
                {allActive ? (
                  <button
                    onClick={deactivateAll}
                    className="rounded-md border border-gray-300 bg-gray-50 px-1 py-0.5 text-xs leading-none shadow-sm hover:bg-yellow-50 focus:ring-1 focus:ring-yellow-500"
                  >
                    Alle deaktivieren
                  </button>
                ) : (
                  <button
                    onClick={activateAll}
                    className="rounded-md border border-gray-300 bg-gray-50 px-1 py-0.5 text-xs leading-none shadow-sm hover:bg-yellow-50 focus:ring-1 focus:ring-yellow-500"
                  >
                    Alle aktivieren
                  </button>
                )}
              </div>
              <Listbox
                key={category}
                multiple
                as="section"
                className=""
                value={dataParam}
                onChange={onChange}
              >
                {({ open }) => {
                  return (
                    <Listbox.Options
                      static
                      className={twJoin(
                        'py-1 text-sm focus:outline-none',
                        // Style all the hover state of all a-tags inside this element; Helps understand the click target when `attributionHtml` has embedded external links.
                        '[&_a:hover]:underline',
                      )}
                    >
                      {datasets.map((dataset) => {
                        return <SelectDataset key={dataset.id} dataset={dataset} />
                      })}
                    </Listbox.Options>
                  )
                }}
              </Listbox>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}
