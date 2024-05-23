import { Listbox, ListboxButton, ListboxOptions, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import React, { Fragment } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { useRegion } from 'src/app/regionen/[regionSlug]/_components/regionUtils/useRegion'
import {
  defaultBackgroundParam,
  useBackgroundParam,
} from 'src/app/regionen/[regionSlug]/_hooks/useQueryState/useBackgroundParam'
import {
  SourcesRasterIds,
  sourcesBackgroundsRaster,
} from '../../_mapData/mapDataSources/sourcesBackgroundsRaster.const'
import { ListOption } from './ListOption'

export const SelectBackground: React.FC = () => {
  const { mainMap } = useMap()
  const { backgroundParam, setBackgroundParam } = useBackgroundParam()
  const region = useRegion()

  if (!region?.backgroundSources) return null

  const backgrounds = sourcesBackgroundsRaster.filter((s) =>
    region?.backgroundSources?.includes(s.id),
  )

  const onChange = (value: SourcesRasterIds) => {
    void setBackgroundParam(value)
  }

  if (!mainMap) return null
  if (!backgroundParam) return null

  return (
    <Listbox as="section" className="" value={backgroundParam} onChange={onChange}>
      <div>
        <ListboxButton className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          Hintergrundkarten
          <ChevronUpDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </ListboxButton>
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
        <ListboxOptions className="absolute bottom-10 right-0 max-h-[calc(100%_-_2.5rem)] w-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListOption
            key={`${backgroundParam}-default`}
            value={defaultBackgroundParam}
            name="Standard"
          />
          {backgrounds.map(({ name, id }) => {
            return <ListOption key={id} value={id} name={name} />
          })}
        </ListboxOptions>
      </Transition>
    </Listbox>
  )
}
