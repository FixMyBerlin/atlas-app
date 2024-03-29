import { ChatBubbleLeftRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import { twJoin } from 'tailwind-merge'
import React from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { Tooltip } from 'src/app/_components/Tooltip/Tooltip'
import { Link } from 'src/app/_components/links/Link'
import { useOsmNotesParam } from '../../_hooks/useQueryState/useOsmNotesParam'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'

export const OsmNotes: React.FC = () => {
  const { osmNotesLoading, osmNotesError } = useMapStateInteraction()
  const { mainMap } = useMap()
  const { osmNotesParam: osmNotesActive, setOsmNotesParam } = useOsmNotesParam()

  const onChange = (value: boolean) => {
    void setOsmNotesParam(value)
  }
  const centerLocation = mainMap?.getCenter()

  return (
    <div className="relative flex shadow-lg">
      <Tooltip
        text={
          osmNotesActive
            ? 'Hinweise von openstreetmap.org ausblenden'
            : 'Hinweise von openstreetmap.org anzeigen'
        }
      >
        <button
          onClick={() => onChange(!osmNotesActive)}
          className={twJoin(
            'z-0 inline-flex justify-center border border-gray-300 px-3 py-2 text-sm font-medium shadow-md focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-yellow-500',
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
          {osmNotesError && (
            <span className="ml-1 text-orange-500">Fehler beim Laden der Hinweise</span>
          )}
        </button>
      </Tooltip>
      <Tooltip text="Hinweis auf openstreetmap.org erstellen">
        <Link
          // Default zoom since Note pins on osm.org are only visible when zoomed in…
          href={`https://www.openstreetmap.org/note/new#map=15/${centerLocation?.lat}/${centerLocation?.lng}`}
          blank
          className={twJoin(
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
