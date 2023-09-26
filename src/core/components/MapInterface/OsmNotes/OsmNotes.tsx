import clsx from 'clsx'
import React from 'react'
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useMap } from 'react-map-gl'
import { SmallSpinner } from 'src/core/components/Spinner/Spinner'
import { useMapStateInteraction } from '../mapStateInteraction'
import Tooltip from 'src/core/components/Tooltip/Tooltip'
import { useNavigate, useSearch } from '@tanstack/react-location'
import { LocationGenerics } from '@routes/index'
import { Link } from 'src/core/components/links'

export const OsmNotes: React.FC = () => {
  const { osmNotesLoading } = useMapStateInteraction()
  const { mainMap } = useMap()
  const { osmNotes: osmNotesActive } = useSearch<LocationGenerics>()

  const navigate = useNavigate<LocationGenerics>()
  const onChange = (value: boolean) => {
    navigate({ search: (old) => ({ ...old, osmNotes: value }) })
  }
  const centerLocation = mainMap?.getCenter()

  return (
    <div className="ml-2 flex shadow-lg">
      <Tooltip
        text={
          osmNotesActive
            ? 'Hinweise von openstreetmap.org ausblenden'
            : 'Hinweise von openstreetmap.org anzeigen'
        }
      >
        <button
          onClick={() => {
            onChange(!osmNotesActive)
          }}
          className={clsx(
            'z-0 inline-flex justify-center border border-gray-300 px-3 py-2 text-sm font-medium shadow-md focus:relative focus:z-10 focus:outline-none  focus:ring-2 focus:ring-yellow-500',
            osmNotesActive ? 'rounded-l-md' : 'rounded-md',
            osmNotesActive ? 'text-gray-700' : 'text-gray-500 hover:text-gray-700',
            osmNotesActive ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-50',
          )}
        >
          {osmNotesLoading ? (
            <div className="flex h-5 w-5 items-center justify-center overflow-hidden">
              {/* Wrapper required to cut off some additional space that <Spinner> has */}
              <SmallSpinner />
            </div>
          ) : (
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          )}
        </button>
      </Tooltip>
      <Tooltip text="Hinweis auf openstreetmap.org erstellen">
        <Link
          // Default zoom since Note pins on osm.org are only visible when zoomed in…
          to={`https://www.openstreetmap.org/note/new#map=15/${centerLocation?.lat}/${centerLocation?.lng}`}
          blank
          className={clsx(
            osmNotesActive ? 'translate-x-0' : '-translate-x-20',
            'z-0 -ml-px justify-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 shadow-md hover:bg-yellow-50 hover:text-gray-700 focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500',
            osmNotesActive ? 'inline-flex' : 'hidden',
          )}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">
            Neuen Hinweis auf openstreetmap.org auf der Karte erstellen
          </span>
        </Link>
      </Tooltip>
    </div>
  )
}
