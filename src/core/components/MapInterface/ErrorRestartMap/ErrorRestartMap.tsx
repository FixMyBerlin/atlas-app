import { Routes, useParam } from '@blitzjs/next'
import { useRouter } from 'next/router'
import React from 'react'
import { Link } from '../../links'

export const ErrorRestartMap: React.FC = () => {
  const regionSlug = useParam('regionSlug', 'string')
  const router = useRouter()

  delete router.query.config

  return (
    <div className="pt-2">
      <p>Leider ist ein Fehler beim Wiederherstellen der Karten-Einstellungen aufgetreten.</p>
      <p>
        <Link href={Routes.ShowRegionPage({ regionSlug: regionSlug! })} className="underline">
          Bitte laden Sie die Karte neu…
        </Link>
      </p>
    </div>
  )
}
