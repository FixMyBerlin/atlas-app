import clsx from 'clsx'
import React from 'react'
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useMap } from 'react-map-gl'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { useMapStateInteraction } from '../mapStateInteraction'
import Tooltip from '@components/Tooltip/Tooltip'
import { useNavigate, useSearch } from '@tanstack/react-location'
import { LocationGenerics } from '@routes/index'
import { Link } from '@components/Link'

interface Props {
  name?: string
}

export const ShowOsmNotes: React.FC<Props> = () => {
  const { osmNotesLoaded } = useMapStateInteraction()
  const { mainMap } = useMap()
  const { osmNotes: osmNotesActive } = useSearch<LocationGenerics>()

  const navigate = useNavigate<LocationGenerics>()
  const onChange = (value: boolean) => {
    navigate({
      search: (old) => {
        return { ...old, osmNotes: value }
      },
    })
  }
  const centerLocation = mainMap?.getCenter()
  const currentZoom = mainMap?.getZoom()

  return (
    <div className="ml-2 shadow-lg">
      <Tooltip
        text={osmNotesActive ? 'OSM-Notes ausblenden' : 'OSM-Notes anzeigen'}
        className="inline-flex"
      >
        <button
          onClick={() => {
            onChange(!osmNotesActive)
          }}
          className={clsx(
            'flex-0 group relative min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
            osmNotesActive ? 'rounded-l-lg' : 'rounded-lg',
            osmNotesActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            osmNotesActive ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-50 focus:z-10'
          )}
        >
          {osmNotesLoaded ? <ChatBubbleLeftRightIcon className="h-5 w-5" /> : <SmallSpinner className="h-5 w-5" />}
          <span
            aria-hidden="true"
            className={clsx(
              osmNotesActive ? 'bg-yellow-500' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5'
            )}
          />
        </button>
      </Tooltip>
      <Tooltip text="OSM-Note erstellen" className="inline-flex">
        <Link
          to={`https://www.openstreetmap.org/note/new#map=${currentZoom}/${centerLocation?.lat}/${centerLocation?.lng}`}
          blank
          className={clsx(
            'flex-0 group min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
            'focus:z-9 rounded-r-lg bg-white hover:bg-yellow-50',
            osmNotesActive ? 'translate-x-0' : '-translate-x-20',
            'text-gray-500 hover:text-gray-700',
            osmNotesActive ? 'inline-flex' : 'hidden'
          )}
        >
          <PlusIcon className="h-5 w-5" />
          <span class="sr-only">Neuen Hinweis auf openstreetmap.org auf der Karte erstellen</span>
        </Link>
      </Tooltip>
    </div>
  )
}
