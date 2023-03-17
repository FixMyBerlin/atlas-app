import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { regionFromPath } from '@routes/utils'
import { useMatch, useNavigate, useSearch } from '@tanstack/react-location'
import React, { Fragment } from 'react'
import { useMap } from 'react-map-gl'
import { sourcesBackgroundsRaster, SourcesRasterIds } from '../mapData'
import { ListOption } from './ListOption'

export const SelectBackground: React.FC = () => {
  const { mainMap } = useMap()
  const { bg: selectedBackgroundId } = useSearch<LocationGenerics>()
  const {
    params: { regionPath },
  } = useMatch()
  const region = regionFromPath(regionPath)

  if (!region?.backgroundSources) return null

  const backgrounds = sourcesBackgroundsRaster.filter((s) =>
    region.backgroundSources.includes(s.id)
  )

  const navigate = useNavigate<LocationGenerics>()
  const onChange = (value: SourcesRasterIds) => {
    navigate({
      search: (old) => {
        return {
          ...old,
          bg: value as SourcesRasterIds,
        }
      },
    })
  }

  if (!mainMap) return null
  if (!selectedBackgroundId) return null

  return (
    <Listbox as="section" className="" value={selectedBackgroundId} onChange={onChange}>
      <div>
        <Listbox.Button className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500">
          Hintergrundkarten
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
        <Listbox.Options className="absolute bottom-10 left-0 mt-1 max-h-[calc(100vh_-_5rem)] w-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListOption key={`${selectedBackgroundId}-default`} value={'default'} name={'Standard'} />
          {backgrounds.map(({ name, id }) => {
            // TODO – This feels hacky. Research solution.
            const keyThatRerendersOnceGeschichteIsReady = `${selectedBackgroundId}-${id}`
            return <ListOption key={keyThatRerendersOnceGeschichteIsReady} value={id} name={name} />
          })}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
