import { LocationGenerics } from '@routes/routes'
import { useMatch, useSearch } from '@tanstack/react-location'
import React from 'react'

export const ErrorRestartMap: React.FC = () => {
  const {
    params: { regionPath },
  } = useMatch()
  const { lat, lng, zoom, bg } = useSearch<LocationGenerics>()

  // We cannot use react-location for the Link, since this will not force a reload of the page.
  const paramsWithoutConfig = new URLSearchParams()
  lat && paramsWithoutConfig.append('lat', lat.toString())
  lng && paramsWithoutConfig.append('lng', lng.toString())
  zoom && paramsWithoutConfig.append('zoom', zoom.toString())
  bg && paramsWithoutConfig.append('bg', bg)

  return (
    <div className="pt-2">
      <p>Leider ist ein Fehler beim Wiederherstellen der Karten-Einstellungen aufgetreten.</p>
      {!!regionPath && (
        <>
          <p>
            <a
              href={`/regionen/${regionPath}?${paramsWithoutConfig.toString()}`}
              className="underline"
            >
              Bitte laden Sie die Karte neu…
            </a>
          </p>
        </>
      )}
    </div>
  )
}
