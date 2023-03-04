import { Link } from '@components/Link'
import { useMatch } from '@tanstack/react-location'
import React from 'react'

export const ErrorRestartMap: React.FC = () => {
  const {
    params: { regionPath },
  } = useMatch()

  return (
    <p className="pt-2 text-red-500">
      Leider ist ein Fehler ist aufgetreten.{' '}
      {!!regionPath && (
        <>
          <br />
          <Link to={`/regionen/${regionPath}`}>
            Bitte laden Sie die Karte neu…
          </Link>
        </>
      )}
    </p>
  )
}
