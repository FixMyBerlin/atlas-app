import { Link } from '@/components/Link'
import { MapIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { mapDataConfig } from '../Map/mapData'
import { useQuery } from '../store'

export const BackgroundLegend: React.FC = () => {
  const {
    values: {
      selectedBackgroundId,
      map: { zoom, lat, lng },
    },
  } = useQuery()

  const selectedBackground = mapDataConfig.backgrounds.find(
    (b) => b.id === selectedBackgroundId
  )
  if (!selectedBackground?.legendUrl) return null

  const enhancedLink = selectedBackground.legendUrl
    .replace('{z}', zoom.toString())
    .replace('{x}', lat.toString())
    .replace('{y}', lng.toString())

  return (
    <Link
      to={enhancedLink}
      blank
      external
      classNameOverwrite="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
      title={`Für die gewählte Hintergrundkarte ${selectedBackground.name} gibt es eine Legene auf einer externen Webseite.`}
    >
      <MapIcon className="-ml-1 mr-1.5 h-5 w-5" aria-hidden="true" />
      Legende
    </Link>
  )
}
