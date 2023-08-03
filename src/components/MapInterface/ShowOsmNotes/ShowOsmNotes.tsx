import clsx from 'clsx'
import React from 'react'
import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useMap } from 'react-map-gl'
import { SmallSpinner } from '@components/Spinner/Spinner'
import { useMapStateInteraction } from '../mapStateInteraction'
import Tooltip from '@components/Tooltip/Tooltip'

interface Props {
  name?: string
}

export const ShowOsmNotes: React.FC<Props> = () => {
  const { osmNotesLoaded, osmNotesActive, setOsmNotesActive } = useMapStateInteraction()
  const { mainMap } = useMap()

  return (
    <div className="ml-2 shadow-lg">
      <Tooltip
        text={osmNotesActive ? 'OSM-Notes ausblenden' : 'OSM-Notes anzeigen'}
        className="inline-flex"
      >
        <button
          onClick={() => setOsmNotesActive(!osmNotesActive)}
          className={clsx(
            'flex-0 group relative min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
            osmNotesActive ? 'rounded-l-lg' : 'rounded-lg',
            osmNotesActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            osmNotesActive ? 'bg-yellow-400' : 'bg-white hover:bg-yellow-50 focus:z-10'
          )}
        >
          <div className="h-5 w-5">
            {osmNotesLoaded && <ChatBubbleLeftRightIcon />}
            {!osmNotesLoaded && <SmallSpinner />}
          </div>
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
        <button
          onClick={() => {
            mainMap ? console.warn('BBOX', mainMap.getBounds()) : null
          }}
          // title="OSM-Note erstellen"
          className={clsx(
            'flex-0 group min-w-0 overflow-hidden whitespace-nowrap py-2 px-3 text-center text-sm font-medium',
            'focus:z-9 rounded-r-lg bg-white hover:bg-yellow-50',
            osmNotesActive ? 'translate-x-0' : '-translate-x-20',
            'text-gray-500 hover:text-gray-700',
            osmNotesActive ? 'inline-flex' : 'hidden'
          )}
        >
          <div className="h-5 w-5">
            <PlusIcon />
          </div>
        </button>
      </Tooltip>
    </div>
  )
}
