import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import React, { Fragment } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { useDataParam } from 'src/app/regionen/_components/useQueryState/useDataParam'
import { ListOption } from './ListOption'
import { useRegionDatasets } from './utils/useRegionDatasets'
import { SourcesDatasetsIds } from '../mapData/sourcesMapData/sourcesDatasets/sourcesDatasets.const'

export const SelectDatasets: React.FC = () => {
  const { mainMap } = useMap()
  const { dataParam, setDataParam } = useDataParam()

  const onChange = (value: SourcesDatasetsIds[]) => {
    void setDataParam(value)
  }

  const regionDatasets = useRegionDatasets()

  if (!mainMap) return null
  if (!regionDatasets?.length) return null

  return (
    <Listbox multiple as="section" className="" value={dataParam} onChange={onChange}>
      <div>
        <Listbox.Button className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          Statische Daten
          <ChevronUpDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Listbox.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Listbox.Options
          className={clsx(
            'absolute bottom-10 left-0 mt-1 max-h-[calc(100vh_-_5rem)] min-w-[15rem] max-w-[20rem] overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
            // Style all the hover state of all a-tags inside this element; Helps understand the click target when `attributionHtml` has embedded external links.
            '[&_a:hover]:underline',
          )}
        >
          {regionDatasets.map(({ id, name, description, attributionHtml }) => {
            return (
              <ListOption
                key={id}
                value={id}
                name={
                  <>
                    {name}
                    {description && (
                      <span
                        className={clsx(
                          description?.includes('(!)') ? 'text-red-400' : 'text-gray-400',
                          'block w-full overflow-visible',
                        )}
                      >
                        {description}
                      </span>
                    )}
                    {attributionHtml && (
                      <span
                        className="block text-xs leading-4 text-gray-400"
                        dangerouslySetInnerHTML={{ __html: attributionHtml }}
                      />
                    )}
                  </>
                }
              />
            )
          })}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
