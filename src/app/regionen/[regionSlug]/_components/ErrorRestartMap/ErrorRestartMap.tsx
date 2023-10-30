import { useSearchParams } from 'next/navigation'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'
import { Link } from 'src/app/_components/links/Link'

export const ErrorRestartMap = () => {
  const regionSlug = useRegionSlug()
  const searchParams = useSearchParams()
  if (searchParams && 'config' in searchParams) {
    delete searchParams.config
  }

  const reloadUrl = `/regionen/${regionSlug}?${new URLSearchParams(searchParams || {})}`

  return (
    <div className="pt-2">
      <p>Leider ist ein Fehler beim Wiederherstellen der Karten-Einstellungen aufgetreten.</p>
      <p>
        <Link href={reloadUrl} className="underline">
          Bitte laden Sie die Karte neu…
        </Link>
      </p>
    </div>
  )
}
