import { Link } from '@components/Link'
import { MapIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { mapDataConfig } from '../mapData'
import { replaceZxy } from '../utils/replaceZxy'

export const BackgroundLegend: React.FC = () => {
  const {
    bg: selectedBackgroundId,
    lat,
    lng,
    zoom,
  } = useSearch<LocationGenerics>()

  const selectedBackground = mapDataConfig.backgrounds.find(
    (b) => b.id === selectedBackgroundId
  )
  if (!selectedBackground?.legendUrl) return null

  const enhancedLink = replaceZxy({
    url: selectedBackground.legendUrl,
    zoom,
    lat,
    lng,
  })

  return (
    <Link
      to={enhancedLink}
      blank
      external
      classNameOverwrite="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 group"
      title={`Für die gewählte Hintergrundkarte ${selectedBackground.name} gibt es eine Legene auf einer externen Webseite.`}
    >
      <div className="relative -ml-1 mr-1.5 h-5 w-5">
        <ArrowTopRightOnSquareIcon
          className="absolute opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />
        <MapIcon
          className="absolute opacity-100 transition-opacity group-hover:opacity-0"
          aria-hidden="true"
        />
      </div>
      Legende
    </Link>
  )
}
