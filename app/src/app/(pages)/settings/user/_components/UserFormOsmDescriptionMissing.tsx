import { SmallSpinner } from '@/src/app/_components/Spinner/SmallSpinner'
import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { linkStyles } from '@/src/app/_components/links/styles'
import { Markdown } from '@/src/app/_components/text/Markdown'
import { getOsmApiUrl, getOsmUrl } from '@/src/app/_components/utils/getOsmUrl'
import updateOsmDescription from '@/src/server/users/mutations/updateOsmDescription'
import { useSession } from '@blitzjs/auth'
import { useMutation } from '@blitzjs/rpc'
import { ClipboardIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'

export const UserFormOsmDescriptionMissing = () => {
  // === Polling to refresh the osmDescription ===
  // Once the user clicks the button to open OSM to update her description, we start polling.
  // We poll 10 times every 5 seconds.
  // If we receive a osmDescription which is text, we stop and reload the page.
  const maxPollCount = 10
  const [pollUpdatedUserdataCount, setPollUpdatedUserdataCount] = useState<number | null>(null)
  const [updateUserOsmDescriptionMutation] = useMutation(updateOsmDescription)
  const session = useSession()
  useEffect(() => {
    if (pollUpdatedUserdataCount === null) return

    const apiUrl = getOsmApiUrl('/user/details.json')
    const pollUserDetails = async () => {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.osmToken}`,
        },
      })

      setPollUpdatedUserdataCount((count) => (count || 0) + 1)

      if (response.ok) {
        const data = await response.json()
        if (data.user.description?.trim()) {
          updateUserOsmDescriptionMutation({ osmDescription: data.user.description })
          setPollUpdatedUserdataCount(null)
          // Brute force reload. The user data of the parent was not updated with router.refresh(), router.push(…), manually calling useQuery refetch, "force-dynamic", … nothing worked =(
          // Docs https://nextjs.org/docs/app/building-your-application/caching#routerrefresh
          // The reload is slow but at least it works…
          location.reload()
        }
      }
    }

    let timerId: ReturnType<typeof setInterval> | null = null
    if (pollUpdatedUserdataCount !== null && pollUpdatedUserdataCount < maxPollCount) {
      timerId = setInterval(pollUserDetails, 5000)
    } else if (timerId) {
      clearInterval(timerId)
    }

    return () => {
      if (timerId) {
        clearInterval(timerId)
      }
    }
  }, [session.osmToken, updateUserOsmDescriptionMutation, pollUpdatedUserdataCount])

  // === Text recommendation and helper to copy the text ===
  const [copySuccess, setCopySuccess] = useState('')
  const textToCopy = `Dies ist ein Account der Abteilung NAME im AMT_NAME. Wir nutzen OSM-Daten für die Erfassung und Planung von Radinfrastruktur mithilfe von [TILDA Radverkehr](https://osm.wiki/FixMyCity_GmbH/TILDA).`
  const copyToClipboard: React.ComponentProps<'button'>['onClick'] = async (event) => {
    event.preventDefault()
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopySuccess('✔︎')
    } catch (err) {
      setCopySuccess('❌ Kopieren fehlgeschlagen')
    }
  }

  return (
    <section
      className="prose prose-sm my-4 rounded border border-amber-300 bg-amber-50 p-4"
      id="description-missing"
    >
      <h3>Bitte vervollständigen Sie Ihr Profil auf OpenStreetMap</h3>
      <p className="my-1">Ihre Profilbeschreibung auf OpenStreetMap ist aktuell leer.</p>
      <p className="my-1">
        Für die OSM-Community ist es hilfreich zu verstehen, aus welchem Kontext / welcher Position
        ein Benutzer stammt, um Hinweise und Beiträge besser einordnen zu können.
      </p>
      <p className="my-1">
        Für die Profilbeschreibung können Sie sich an dem Vorschlag unten zu orientieren.
      </p>
      <p className="my-2 flex items-center gap-2">
        <LinkExternal
          button
          blank
          href={getOsmUrl('/profile/edit')}
          onClick={() => setPollUpdatedUserdataCount(0)}
          className="bg-yellow-200 shadow"
        >
          Profilbeschreibung ergänzen
        </LinkExternal>
        {pollUpdatedUserdataCount !== null && (
          <span className="flex items-center gap-2">
            <SmallSpinner />
            <span className="text-xs">
              Prüfe periodisch auf neue Profildaten ({pollUpdatedUserdataCount} / {maxPollCount})…
            </span>
          </span>
        )}
      </p>

      <blockquote>
        <Markdown markdown={textToCopy} />
      </blockquote>
      <button onClick={copyToClipboard} className={twJoin('flex items-center gap-0.5', linkStyles)}>
        <ClipboardIcon className="h-5 w-5" />
        Textvorlage kopieren {copySuccess}
      </button>
    </section>
  )
}
