import { useRouter } from 'next/navigation'
import React from 'react'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Link } from 'src/app/_components/links/Link'

export const ErrorRestartMap: React.FC = () => {
  const regionSlug = useRegionSlug()
  const router = useRouter()

  // TODO MIGRATION: Previously this kept all itesm except for the config param.
  // However, need to be done differently, now.
  //
  // delete router.query.config

  return (
    <div className="pt-2">
      <p>Leider ist ein Fehler beim Wiederherstellen der Karten-Einstellungen aufgetreten.</p>
      <p>
        <Link href={`/regionen/${regionSlug}`} className="underline">
          Bitte laden Sie die Karte neu…
        </Link>
      </p>
    </div>
  )
}
