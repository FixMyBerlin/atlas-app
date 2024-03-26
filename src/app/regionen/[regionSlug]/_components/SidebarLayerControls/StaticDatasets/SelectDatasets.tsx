import { Disclosure, Listbox, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  LinkIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { LinkExternal } from 'src/app/_components/links/LinkExternal'
import { isProd } from 'src/app/_components/utils/isEnv'
import { twJoin } from 'tailwind-merge'
import { useDataParam } from '../../../_hooks/useQueryState/useDataParam'
import { useRegionDatasets } from '../../../_hooks/useRegionDatasets/useRegionDatasets'
import { createSourceKeyStaticDatasets } from '../../utils/sourceKeyUtils/sourceKeyUtilsStaticDataset'
import { iconFromLegend } from '../Legend/Legend'
import { LegendNameDesc } from '../Legend/LegendNameDesc'

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
                      {datasets.map(
                        ({ id, subId, name, description, attributionHtml, legends, isPublic }) => {
                          const key = createSourceKeyStaticDatasets(id, subId)
                          return (
                            <Listbox.Option
                              key={key}
                              value={key}
                              className={({ active, selected }) =>
                                twJoin(
                                  'relative cursor-pointer select-none py-2 pl-1.5 pr-2 leading-tight text-gray-900',
                                  selected ? 'bg-yellow-400' : 'hover:bg-yellow-50',
                                )
                              }
                            >
                              {({ active, selected }) => (
                                <>
                                  <div className="justify-left relative flex items-center gap-1">
                                    <CheckIcon
                                      className={twJoin(
                                        'h-5 w-5 flex-none',
                                        selected ? 'text-yellow-900' : 'text-gray-100',
                                      )}
                                      aria-hidden="true"
                                    />
                                    <div className="flex grow justify-between gap-1 font-medium">
                                      {name}
                                      {!isPublic && (
                                        <LockClosedIcon
                                          className="h-4 w-4 text-gray-400"
                                          title="Datensatz nur für angemeldete Nutzer:innen mit Rechten für die Region sichtbar."
                                        />
                                      )}
                                      {!isProd && (
                                        <LinkExternal
                                          blank
                                          href={`https://github.com/FixMyBerlin/atlas-static-data/tree/main/geojson/${id}`}
                                          className="absolute bottom-1 right-1 text-pink-500 hover:text-pink-800"
                                          title='Öffne den Datensatz im "atlas-static-data" Repository auf GitHub; Link nur in Dev und Staging sichtbar.'
                                        >
                                          <LinkIcon className="h-4 w-4" />
                                        </LinkExternal>
                                      )}
                                    </div>
                                  </div>
                                  {selected && description && (
                                    <p
                                      className={twJoin(
                                        'mt-1',
                                        description?.includes('(!)') ? 'text-red-400' : '',
                                      )}
                                    >
                                      {description}
                                    </p>
                                  )}
                                  {selected && attributionHtml && (
                                    <p
                                      className="mt-1 text-xs leading-4"
                                      dangerouslySetInnerHTML={{ __html: attributionHtml }}
                                    />
                                  )}
                                  {selected && legends && Boolean(legends?.length) && (
                                    <ul>
                                      {legends.map((legend) => {
                                        return (
                                          <li
                                            className="group relative mt-1 flex items-center font-normal leading-tight"
                                            key={legend.id}
                                          >
                                            <div className="h-5 w-5 flex-none">
                                              {iconFromLegend(legend)}
                                            </div>
                                            <LegendNameDesc name={legend.name} desc={legend.desc} />
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          )
                        },
                      )}
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
