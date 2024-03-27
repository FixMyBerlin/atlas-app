import { Disclosure, Listbox, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  LinkIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { isProd } from 'src/app/_components/utils/isEnv'
import { twJoin } from 'tailwind-merge'
import { useDataParam } from '../../../_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { createSourceKeyStaticDatasets } from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { iconFromLegend } from '../Legend/Legend'
import { LegendNameDesc } from '../Legend/LegendNameDesc'
import { SelectDataset } from './SelectDataset'

export const SelectDatasets = ({
  category,
  datasets,
}: {
  category: string
  datasets: ReturnType<typeof useRegionDatasets>
}) => {
  const { dataParam, setDataParam } = useDataParam()

  const onChange = (value: string[]) => {
    void setDataParam(value)
  }

  const categoryName = category.split('/').at(-1)
  const active = dataParam.some((param) =>
    datasets.map((d) => createSourceKeyStaticDatasets(d.id, d.subId)).includes(param),
  )

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
            <Disclosure.Panel static as="nav" className="mb-2 mt-3">
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
                        'py-1 text-sm ring-1 ring-black ring-opacity-5 focus:outline-none',
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
